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

# Chennai wards (Wards 101 to 150)
wards_data = [
    {"number": 101, "name": "Anna Nagar East", "zone": "Zone 8: Anna Nagar"},
    {"number": 102, "name": "Anna Nagar South", "zone": "Zone 8: Anna Nagar"},
    {"number": 103, "name": "Aminjikarai", "zone": "Zone 8: Anna Nagar"},
    {"number": 104, "name": "Arumbakkam", "zone": "Zone 8: Anna Nagar"},
    {"number": 105, "name": "Koyambedu", "zone": "Zone 8: Anna Nagar"},
    {"number": 106, "name": "Koyambedu South", "zone": "Zone 8: Anna Nagar"},
    {"number": 107, "name": "Arumbakkam South", "zone": "Zone 8: Anna Nagar"},
    {"number": 108, "name": "MMDA Colony", "zone": "Zone 8: Anna Nagar"},
    {"number": 109, "name": "Chetpet", "zone": "Zone 9: Teynampet"},
    {"number": 110, "name": "Egmore", "zone": "Zone 9: Teynampet"},
    {"number": 111, "name": "Pudupet", "zone": "Zone 9: Teynampet"},
    {"number": 112, "name": "Chintadripet", "zone": "Zone 9: Teynampet"},
    {"number": 113, "name": "Komaleeswaranpet", "zone": "Zone 9: Teynampet"},
    {"number": 114, "name": "Triplicane", "zone": "Zone 9: Teynampet"},
    {"number": 115, "name": "Chepauk South", "zone": "Zone 9: Teynampet"},
    {"number": 116, "name": "Royapettah", "zone": "Zone 9: Teynampet"},
    {"number": 117, "name": "Nungambakkam", "zone": "Zone 9: Teynampet"},
    {"number": 118, "name": "Thousand Lights", "zone": "Zone 9: Teynampet"},
    {"number": 119, "name": "Gopalapuram", "zone": "Zone 9: Teynampet"},
    {"number": 120, "name": "Santhome", "zone": "Zone 9: Teynampet"},
    {"number": 121, "name": "Mylapore", "zone": "Zone 9: Teynampet"},
    {"number": 122, "name": "Alwarpet", "zone": "Zone 9: Teynampet"},
    {"number": 123, "name": "Teynampet", "zone": "Zone 9: Teynampet"},
    {"number": 124, "name": "T. Nagar", "zone": "Zone 9: Teynampet"},
    {"number": 125, "name": "CIT Nagar", "zone": "Zone 9: Teynampet"},
    {"number": 126, "name": "Nandanam", "zone": "Zone 9: Teynampet"},
    {"number": 127, "name": "Kodambakkam North", "zone": "Zone 10: Kodambakkam"},
    {"number": 128, "name": "Vadapalani", "zone": "Zone 10: Kodambakkam"},
    {"number": 129, "name": "Kodambakkam West", "zone": "Zone 10: Kodambakkam"},
    {"number": 130, "name": "Kodambakkam", "zone": "Zone 10: Kodambakkam"},
    {"number": 131, "name": "West Mambalam", "zone": "Zone 10: Kodambakkam"},
    {"number": 132, "name": "Ashok Nagar", "zone": "Zone 10: Kodambakkam"},
    {"number": 133, "name": "KK Nagar North", "zone": "Zone 10: Kodambakkam"},
    {"number": 134, "name": "KK Nagar", "zone": "Zone 10: Kodambakkam"},
    {"number": 135, "name": "MGR Nagar", "zone": "Zone 10: Kodambakkam"},
    {"number": 136, "name": "Jafferkhanpet", "zone": "Zone 10: Kodambakkam"},
    {"number": 137, "name": "Saidapet West", "zone": "Zone 10: Kodambakkam"},
    {"number": 138, "name": "Saidapet", "zone": "Zone 10: Kodambakkam"},
    {"number": 139, "name": "Guindy West", "zone": "Zone 10: Kodambakkam"},
    {"number": 140, "name": "West Mambalam South", "zone": "Zone 10: Kodambakkam"},
    {"number": 141, "name": "CIT Nagar South", "zone": "Zone 10: Kodambakkam"},
    {"number": 142, "name": "Saidapet East", "zone": "Zone 10: Kodambakkam"},
    {"number": 143, "name": "Alapakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 144, "name": "Porur", "zone": "Zone 11: Valasaravakkam"},
    {"number": 145, "name": "Valasaravakkam North", "zone": "Zone 11: Valasaravakkam"},
    {"number": 146, "name": "Valasaravakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 147, "name": "Karambakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 148, "name": "Chinna Porur", "zone": "Zone 11: Valasaravakkam"},
    {"number": 149, "name": "Ramapuram North", "zone": "Zone 11: Valasaravakkam"},
    {"number": 150, "name": "Ramapuram", "zone": "Zone 11: Valasaravakkam"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve "Chennai" district
    district_doc = await db.districts.find_one({"name": "Chennai"})
    assert district_doc, "District 'Chennai' must exist!"
    district_id = district_doc["_id"]
    print(f"Found District 'Chennai' with ID: {district_id}")

    # 2. Append/update wards (Wards 101 to 150)
    inserted_count = 0
    updated_count = 0
    
    for w in wards_data:
        ward_num = w["number"]
        ward_name = w["name"]
        zone = w["zone"]
        display_name = f"Ward {ward_num} - {ward_name}"
        
        # Check if ward already exists
        existing_ward = await db.wards.find_one({
            "district_id": district_id,
            "ward_number": ward_num
        })
        
        if existing_ward:
            await db.wards.update_one(
                {"_id": existing_ward["_id"]},
                {
                    "$set": {
                        "ward_name": ward_name,
                        "zone": zone,
                        "display_name": display_name,
                        "label": display_name,
                        "description": display_name,
                        "local_body": "Greater Chennai Corporation",
                        "is_active": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            print(f"Updated existing Ward: {display_name}")
            updated_count += 1
        else:
            new_ward = {
                "district": "Chennai",
                "local_body": "Greater Chennai Corporation",
                "district_id": district_id,
                "ward_name": ward_name,
                "ward_number": ward_num,
                "zone": zone,
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
            print(f"Inserted Ward: {display_name} ({zone})")
            inserted_count += 1
            
    print(f"\nAppending summary: {inserted_count} wards inserted, {updated_count} wards updated.")

if __name__ == "__main__":
    asyncio.run(seed())
