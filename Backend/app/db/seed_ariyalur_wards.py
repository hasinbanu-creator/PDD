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

# Official Ariyalur wards
wards_data = [
    {"number": "01", "name": "Ambedkar Street Area"},
    {"number": "02", "name": "Kamarajar Nagar (Including 4th Street) and Mariyamman Kovil Street"},
    {"number": "03", "name": "Periyar Nagar (Including 5th Street) and Sivaperumal Street"},
    {"number": "04", "name": "K. Rajaji Nagar (College Road Zones)"},
    {"number": "05", "name": "Rajaji Nagar 2nd Street and Atjutha Apartments Area"},
    {"number": "06", "name": "Pookkara Street and Karuthan Padaiyatchi Street"},
    {"number": "07", "name": "Muniyappar Street, Singara Theru, and Asaithambi Theru"},
    {"number": "08", "name": "Andiyappar Street Area"},
    {"number": "09", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "10", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "11", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "12", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "13", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "14", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "15", "name": "Core Commercial and Expanding Residential Blocks Including Market Areas"},
    {"number": "16", "name": "Samapasivam Street and Chinnakadai Street"},
    {"number": "17", "name": "Tholkidangu Street, Vadakku Throbathi Amman Kovil Street, Vandikara Street, and Kaythemilath Ismail Street"},
    {"number": "18", "name": "Thandavarayan Street, Somu Street, Santhapet Street, Ramasamy Street, and Panju Pattarai Street"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Ariyalur" district
    district_doc = await db.districts.find_one({"name": "Ariyalur"})
    if not district_doc:
        print("District 'Ariyalur' not found. Creating it...")
        new_district = {
            "name": "Ariyalur",
            "code": "ARI",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "ariyalur@civifix.local",
            "phone": None,
            "address": "Ariyalur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Ariyalur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Ariyalur' with ID: {district_id}")

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
                        "local_body": "Ariyalur Municipality",
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
                "district": "Ariyalur",
                "local_body": "Ariyalur Municipality",
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
