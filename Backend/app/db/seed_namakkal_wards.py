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

# Official Namakkal wards
wards_data = [
    {"number": "01", "name": "Periyaayampalayam & Nallipalayam (North Salem Road entry)"},
    {"number": "02", "name": "VIP Nagar & Mudalaipatty"},
    {"number": "03", "name": "Rajiv Gandhi Nagar (Salem Road area)"},
    {"number": "04", "name": "Thillaipuram North"},
    {"number": "05", "name": "Thillaipuram Central"},
    {"number": "06", "name": "Thillaipuram South"},
    {"number": "07", "name": "Gounder Kuttai & Seluvampatti Areas"},
    {"number": "08", "name": "Co-operative Colony"},
    {"number": "09", "name": "R.P. Pudur Extension"},
    {"number": "10", "name": "R.P. Pudur Main Road"},
    {"number": "11", "name": "Nallipalayam Southern Blocks"},
    {"number": "12", "name": "Kosavampatti"},
    {"number": "13", "name": "Kosavampatti Lake Residential Belt"},
    {"number": "14", "name": "S.P. Pudur North"},
    {"number": "15", "name": "S.P. Pudur South"},
    {"number": "16", "name": "Kamaraj Nagar"},
    {"number": "17", "name": "Mohanur Road Residential Areas"},
    {"number": "18", "name": "Paramathi Road West Residential Zones"},
    {"number": "19", "name": "Paramathi Road East Residential Zones"},
    {"number": "20", "name": "Ganesapuram"},
    {"number": "21", "name": "Fort Area Western Base (Kottai Area)"},
    {"number": "22", "name": "Namakkal Rock Fort Foothills"},
    {"number": "23", "name": "Main Bazaar (Central Commercial Hub)"},
    {"number": "24", "name": "Car Street / Anjaneyar Temple Zone"},
    {"number": "25", "name": "Bus Stand Commercial Blocks"},
    {"number": "26", "name": "Trichy Road Northern Cross"},
    {"number": "27", "name": "New Agraharam & Thiruppakkula Street"},
    {"number": "28", "name": "Mullai Nagar"},
    {"number": "29", "name": "EB Colony North"},
    {"number": "30", "name": "EB Colony Main"},
    {"number": "31", "name": "Chinnamudalaipatti North"},
    {"number": "32", "name": "Chinnamudalaipatti Central"},
    {"number": "33", "name": "Maruthi Nagar"},
    {"number": "34", "name": "Kondichettipatti West"},
    {"number": "35", "name": "Kondichettipatti Central"},
    {"number": "36", "name": "Swamy Nagar North"},
    {"number": "37", "name": "Swamy Nagar South / Kariapatti Blocks"},
    {"number": "38", "name": "Rajaji Nagar & Bharathy Nagar"},
    {"number": "39", "name": "Kondichettipatti East, Teachers Colony & Swamy Nagar"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Namakkal" district
    district_doc = await db.districts.find_one({"name": "Namakkal"})
    if not district_doc:
        print("District 'Namakkal' not found. Creating it...")
        new_district = {
            "name": "Namakkal",
            "code": "NKL",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "namakkal@civifix.local",
            "phone": None,
            "address": "Namakkal District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Namakkal' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Namakkal' with ID: {district_id}")

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
                        "local_body": "Namakkal City Municipal Corporation",
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
                "district": "Namakkal",
                "local_body": "Namakkal City Municipal Corporation",
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
