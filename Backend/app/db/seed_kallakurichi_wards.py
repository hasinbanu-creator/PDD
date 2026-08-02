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

# Official Kallakurichi wards (skipping Wards 01 and 08 as requested)
wards_data = [
    {"number": "02", "name": "V.O.C. Nagar"},
    {"number": "03", "name": "Kesavalu Nagar"},
    {"number": "04", "name": "Kamamanandhal Salai"},
    {"number": "05", "name": "Kulathumedu Street"},
    {"number": "06", "name": "Vaikalmedu Street"},
    {"number": "07", "name": "Kotaimedu"},
    {"number": "09", "name": "New Colony, Karunapuram"},
    {"number": "10", "name": "M.R.N. Nagar, Durugam Salai"},
    {"number": "11", "name": "Gandhi Road, Raja Nagar"},
    {"number": "12", "name": "Sundaravinayagar Kovil Street"},
    {"number": "13", "name": "Agarathankollai Street"},
    {"number": "14", "name": "Villanthangal Road"},
    {"number": "15", "name": "Manikondu Street"},
    {"number": "16", "name": "Chidambaram Pillai Street, Serali Nagar"},
    {"number": "17", "name": "EB Colony, Anna Nagar"},
    {"number": "18", "name": "Kavarai Street"},
    {"number": "19", "name": "School Street, Emapper"},
    {"number": "20", "name": "Mariyamman Kovil Street"},
    {"number": "21", "name": "Emapper Colony"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Kallakurichi" district
    district_doc = await db.districts.find_one({"name": "Kallakurichi"})
    if not district_doc:
        print("District 'Kallakurichi' not found. Creating it...")
        new_district = {
            "name": "Kallakurichi",
            "code": "KKI",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "kallakurichi@civifix.local",
            "phone": None,
            "address": "Kallakurichi District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Kallakurichi' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Kallakurichi' with ID: {district_id}")

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
                        "local_body": "Kallakurichi Municipality",
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
                "district": "Kallakurichi",
                "local_body": "Kallakurichi Municipality",
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
