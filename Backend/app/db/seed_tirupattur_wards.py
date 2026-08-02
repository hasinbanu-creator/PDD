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

# Official Tirupattur wards
wards_data = [
    {"number": "01", "name": "Rettaimalai Srinivasan Pettai"},
    {"number": "02", "name": "Anumantha Ubasagar Pettai & Sakthi Nagar"},
    {"number": "03", "name": "Bosco Nagar & Sivaraj Pettai"},
    {"number": "04", "name": "Marriamman Kovil Street & Gandhi Pettai"},
    {"number": "05", "name": "Gandhi Road"},
    {"number": "06", "name": "Palanisamy Main Road"},
    {"number": "07", "name": "Ponniyamman Kovil Street"},
    {"number": "08", "name": "Fort Area & Fort Street"},
    {"number": "09", "name": "Jinnah Road (Main Sections)"},
    {"number": "10", "name": "Hasanpura & Bazaar Street Borders"},
    {"number": "11", "name": "Khaderpet Residential Zones"},
    {"number": "12", "name": "Ambur Merku Street Areas"},
    {"number": "13", "name": "Pudupet Road (Lower Blocks)"},
    {"number": "14", "name": "Dharmaraja Kovil 1st to 11th Streets & T.P. Puran Street"},
    {"number": "15", "name": "Railway Colony, Ari Street & Government Poonga"},
    {"number": "16", "name": "Krishnagiri Road Layouts"},
    {"number": "17", "name": "Chairman Kullapanar Street"},
    {"number": "18", "name": "Duvaragapiliyar Street"},
    {"number": "19", "name": "I.G. Sanjeeviyar Street, Sivanar Street, E.L. Ragavanar Street & Balammal Colony"},
    {"number": "20", "name": "Achamangalam Border Streets"},
    {"number": "21", "name": "Tirupattur Main Bazaar Sectors"},
    {"number": "22", "name": "Nelvayal Area Blocks"},
    {"number": "23", "name": "Sandaipettai Residential Lanes"},
    {"number": "24", "name": "Housing Board Colony (Partial Blocks)"},
    {"number": "25", "name": "Cutcherry Road Layouts"},
    {"number": "26", "name": "Vaniyambadi Road Lines"},
    {"number": "27", "name": "Kottai Street Extensions"},
    {"number": "28", "name": "PWD Quarters Area Lanes"},
    {"number": "29", "name": "Myan Nagar Residential Layouts"},
    {"number": "30", "name": "Salem Road Residential Side Streets"},
    {"number": "31", "name": "Municipal Laborer Colony, Chairman Arumuganar Street, Anna Nagar & Kalaignar Nagar"},
    {"number": "32", "name": "Jolarpet Road Urban Limits"},
    {"number": "33", "name": "Tamil Nadu Housing Board (TNHB) Phase 1"},
    {"number": "34", "name": "Chairman Duraisamy Street"},
    {"number": "35", "name": "Salem Road (Main Sections) & Chairman Arumuganar Street Limits"},
    {"number": "36", "name": "Sivaraj Pettai (Outer Sectors)"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Tirupattur" district
    district_doc = await db.districts.find_one({"name": "Tirupattur"})
    if not district_doc:
        print("District 'Tirupattur' not found. Creating it...")
        new_district = {
            "name": "Tirupattur",
            "code": "TPT",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "tirupattur@civifix.local",
            "phone": None,
            "address": "Tirupattur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Tirupattur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Tirupattur' with ID: {district_id}")

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
                        "local_body": "Tirupattur Municipality",
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
                "district": "Tirupattur",
                "local_body": "Tirupattur Municipality",
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
