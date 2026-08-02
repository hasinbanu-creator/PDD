import asyncio
import os
import sys
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient

# Add Backend folder to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from dotenv import load_dotenv
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env")))

# Official Perambalur wards
wards_data = [
    {"number": "01", "name": "Kurinji Nagar, Alambadi Road, Samathuvapuram, New Colony (Streets 1 to 9)"},
    {"number": "02", "name": "Dalphin Nagar, Vadakku Mathavi Road"},
    {"number": "03", "name": "Rose Nagar, Elambalur Road"},
    {"number": "04", "name": "Angalamman Kovil Street"},
    {"number": "05", "name": "Mathanagopalapuram"},
    {"number": "06", "name": "New Mathanagopalapuram"},
    {"number": "07", "name": "Thuraimangalam New Colony"},
    {"number": "08", "name": "Avvaiyar Street, Avvaiyar South Street"},
    {"number": "09", "name": "Avvaiyar Street (Central Portion), Thuraimangalam Eri Road"},
    {"number": "10", "name": "Thuraimangalam North Street, Thuraimangalam North Area"},
    {"number": "11", "name": "Vengadesapuram, Old S.P. Office Area, Rice Mill Street, Palakarai"},
    {"number": "12", "name": "Nirmala Nagar, Near Dominik School Area"},
    {"number": "13", "name": "Arunachala Gounder Nagar, Cavery Mahal Backside"},
    {"number": "14", "name": "Matharsha Road, Near Old Bus Stand Area"},
    {"number": "15", "name": "Thiru Nagar, Suganesh Nagar, Asia Nagar"},
    {"number": "16", "name": "Green Garden Area, Ram Nagar, Green City Main Road"},
    {"number": "17", "name": "Nehru Nagar, RMK Nagar, Global Nagar"},
    {"number": "18", "name": "Sri Renga Nagar, Natesan Nagar, Balaji Nagar"},
    {"number": "19", "name": "Ambedkar Street, Muthu Nagar West Main Road"},
    {"number": "20", "name": "Samiyappa Nagar, East Mettu Street"},
    {"number": "21", "name": "Thuraimangalam Middle Street"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Perambalur" district
    district_doc = await db.districts.find_one({"name": "Perambalur"})
    if not district_doc:
        print("District 'Perambalur' not found. Creating it...")
        new_district = {
            "name": "Perambalur",
            "code": "PER",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "perambalur@civifix.local",
            "phone": None,
            "address": "Perambalur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Perambalur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Perambalur' with ID: {district_id}")

    # 2. Seed/update wards
    inserted_count = 0
    updated_count = 0
    
    for w in wards_data:
        ward_num = w["number"]
        ward_name = w["name"]
        display_name = f"{ward_num} - {ward_name}"
        
        # Check if ward already exists in this district
        existing_ward = await db.wards.find_one({
            "district_id": district_id,
            "ward_number": ward_num
        })
        
        if existing_ward:
            # Update existing ward
            await db.wards.update_one(
                {"_id": existing_ward["_id"]},
                {
                    "$set": {
                        "ward_name": ward_name,
                        "display_name": display_name,
                        "label": display_name,
                        "local_body": "Perambalur Municipality",
                        "is_active": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            print(f"Updated existing Ward {display_name}")
            updated_count += 1
        else:
            # Insert new ward
            new_ward = {
                "district": "Perambalur",
                "local_body": "Perambalur Municipality",
                "district_id": district_id,
                "ward_name": ward_name,
                "ward_number": ward_num,
                "display_name": display_name,
                "label": display_name,
                "description": display_name,
                "inspector_id": None,
                "area_coordinates": None,
                "is_active": True,
                "complaint_count": 0,
                "active_complaints": 0,
                "closed_complaints": 0,
                "created_by": None,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.wards.insert_one(new_ward)
            print(f"Inserted Ward {display_name}")
            inserted_count += 1
            
    print(f"\nSeeding summary: {inserted_count} wards inserted, {updated_count} wards updated.")

if __name__ == "__main__":
    asyncio.run(seed())
