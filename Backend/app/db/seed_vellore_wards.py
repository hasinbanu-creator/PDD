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

# Official Vellore wards
wards_data = [
    {"number": "01", "name": "Vandranthangal / Kalpudur"},
    {"number": "02", "name": "Dharapadavedu West"},
    {"number": "03", "name": "Dharapadavedu East"},
    {"number": "04", "name": "Katpadi Central"},
    {"number": "05", "name": "Kumarappa Nagar"},
    {"number": "06", "name": "Kalinjur North"},
    {"number": "07", "name": "Kalinjur Central"},
    {"number": "08", "name": "Virupakshipuram / Gandhi Nagar"},
    {"number": "09", "name": "Virudampattu / Kazhinjur"},
    {"number": "10", "name": "Kangeyanallur West"},
    {"number": "11", "name": "Kangeyanallur East"},
    {"number": "12", "name": "Odgathur / Auxilium Area"},
    {"number": "13", "name": "Suthanthira Nagar"},
    {"number": "14", "name": "Old Katpadi North"},
    {"number": "15", "name": "Old Katpadi South"},
    {"number": "16", "name": "Sathuvachari Phase 1"},
    {"number": "17", "name": "Sathuvachari Phase 2"},
    {"number": "18", "name": "Sathuvachari North"},
    {"number": "19", "name": "Rangapuram West"},
    {"number": "20", "name": "Rangapuram East"},
    {"number": "21", "name": "Vellore Phase 3 / TNHB"},
    {"number": "22", "name": "Sathuvachari Hills / Perumal Nagar"},
    {"number": "23", "name": "Thottapalayam North"},
    {"number": "24", "name": "Thottapalayam West"},
    {"number": "25", "name": "Thottapalayam East"},
    {"number": "26", "name": "Kagithapattarai West"},
    {"number": "27", "name": "Kagithapattarai East"},
    {"number": "28", "name": "Saidapet Market North"},
    {"number": "29", "name": "Saidapet Central"},
    {"number": "30", "name": "Saidapet East"},
    {"number": "31", "name": "Fort Area / Officers Line"},
    {"number": "32", "name": "Torapadi Entry / Long Bazaar"},
    {"number": "33", "name": "Velapadi North"},
    {"number": "34", "name": "Velapadi South"},
    {"number": "35", "name": "Salavanpet West"},
    {"number": "36", "name": "Salavanpet Central"},
    {"number": "37", "name": "Salavanpet East"},
    {"number": "38", "name": "Vasanthapuram South"},
    {"number": "39", "name": "Sankaranpalayam West"},
    {"number": "40", "name": "Sankaranpalayam East"},
    {"number": "41", "name": "Kaspa North"},
    {"number": "42", "name": "Kaspa Central"},
    {"number": "43", "name": "Kaspa South"},
    {"number": "44", "name": "Otteri North"},
    {"number": "45", "name": "Otteri Central"},
    {"number": "46", "name": "Thorapadi North"},
    {"number": "47", "name": "Thorapadi Central"},
    {"number": "48", "name": "Thorapadi South"},
    {"number": "49", "name": "Allapuram West"},
    {"number": "50", "name": "Allapuram East"},
    {"number": "51", "name": "Bagayam North"},
    {"number": "52", "name": "Bagayam Central"},
    {"number": "53", "name": "Bagayam Rural / Sripuram"},
    {"number": "54", "name": "Konavattam North"},
    {"number": "55", "name": "Konavattam Central"},
    {"number": "56", "name": "Konavattam South"},
    {"number": "57", "name": "Shenbakkam West"},
    {"number": "58", "name": "Shenbakkam East"},
    {"number": "59", "name": "Chitteri / Shenbakkam Link"},
    {"number": "60", "name": "Idayansathu"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Vellore" district
    district_doc = await db.districts.find_one({"name": "Vellore"})
    if not district_doc:
        print("District 'Vellore' not found. Creating it...")
        new_district = {
            "name": "Vellore",
            "code": "VEL",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "vellore@civifix.local",
            "phone": None,
            "address": "Vellore District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Vellore' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Vellore' with ID: {district_id}")

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
                        "local_body": "Vellore City Municipal Corporation",
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
                "district": "Vellore",
                "local_body": "Vellore City Municipal Corporation",
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
