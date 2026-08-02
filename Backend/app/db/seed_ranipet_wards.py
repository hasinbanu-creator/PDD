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

# Official Ranipet wards
wards_data = [
    {"number": "01", "name": "Karai zone, focusing around Mosque Street."},
    {"number": "02", "name": "Karai extended zone, featuring the TNHB Quarters."},
    {"number": "03", "name": "Periyar Nagar and the main Vanapadi Road."},
    {"number": "04", "name": "Kelly's Road and western portions of Navalpur."},
    {"number": "05", "name": "Pilliyar Koil Street Lane and central Navalpur."},
    {"number": "06", "name": "Parai Street in the Navalpur locality."},
    {"number": "07", "name": "Othavadai Street in Navalpur."},
    {"number": "08", "name": "Mariamman Koil Street and nearby residential lanes."},
    {"number": "09", "name": "Otteri Colony area, extending toward Old Thiruthani Road."},
    {"number": "10", "name": "Srinivasanpet and Kamarajar Street residential limits."},
    {"number": "11", "name": "Jeyaram Nagar, Pinji, and adjoining North Street limits."},
    {"number": "12", "name": "V.M.C. Road commercial corridors."},
    {"number": "13", "name": "Railway Station Road territory."},
    {"number": "14", "name": "T.M.N. Street and surrounding pockets of Navalpur."},
    {"number": "15", "name": "Boundary lanes near the Navalpur industrial/residential split."},
    {"number": "16", "name": "Central commercial zones bordering Trunk Road."},
    {"number": "17", "name": "Residential blocks running parallel to the main MBT Road."},
    {"number": "18", "name": "Markets and retail stretches around Bazaar Street channels."},
    {"number": "19", "name": "Old town housing layouts and Alamaram Street."},
    {"number": "20", "name": "Pudu Street and Pudu Street Extension blocks."},
    {"number": "21", "name": "Bajanai Koil Street and Arignar Anna Street limits."},
    {"number": "22", "name": "West Cotton Bazaar Road layouts."},
    {"number": "23", "name": "Trunk Road central markets, Reading Room Road, and Vandi Mettu Street."},
    {"number": "24", "name": "Mundi Street, Amman Koil Street, Vajeeravelu Street, and Veeraperumal Street."},
    {"number": "25", "name": "School Street and residential settlements in Pinji."},
    {"number": "26", "name": "Ellapan Street, Anjanayar Koil Street, Erikarai Street, and Velu Street."},
    {"number": "27", "name": "Arcot Road boundary layouts and Mahaveer Nagar."},
    {"number": "28", "name": "Rajarathinam Street, Somu Street, and Aathukalvai Street lanes."},
    {"number": "29", "name": "Middle Street region located inside Pinji."},
    {"number": "30", "name": "Bye-Pass Road West, Puli Street, Gandhi Nagar, and Zakiher Usan Street."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Ranipet" district
    district_doc = await db.districts.find_one({"name": "Ranipet"})
    if not district_doc:
        print("District 'Ranipet' not found. Creating it...")
        new_district = {
            "name": "Ranipet",
            "code": "RPT",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "ranipet@civifix.local",
            "phone": None,
            "address": "Ranipet District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Ranipet' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Ranipet' with ID: {district_id}")

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
                "district": "Ranipet",
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
