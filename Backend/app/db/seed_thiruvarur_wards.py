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

# Official Thiruvarur wards
wards_data = [
    {"number": "01", "name": "Tamil Nadu Housing Unit, Durkkalaya Road, Thendral Nagar"},
    {"number": "02", "name": "V.O.C. Street, Swamy Madatheru, Thendral Nagar"},
    {"number": "03", "name": "Vadakku Kotha Street, Kamaraja Street"},
    {"number": "04", "name": "Jayam Street, Kodikkalpalayam"},
    {"number": "05", "name": "Soobi Nadu Street, Ashath Nagar, Kodikkalpalayam"},
    {"number": "06", "name": "Mudukku Street, E.V.S. Nagar"},
    {"number": "07", "name": "Karthigai Street, Ramanathan Nagar"},
    {"number": "08", "name": "Durgalaya Street"},
    {"number": "09", "name": "V.O.C. Street, Maruthapadi Street"},
    {"number": "10", "name": "V.O.C. Street, Kanthappa Mada Street"},
    {"number": "11", "name": "Karaikkattu Street, Maruthapadi, Vadakkuvadambokki Street"},
    {"number": "12", "name": "Kulunthankulam Keelkarai, Erutthikara Street, Tiruvalluvar Nagar"},
    {"number": "13", "name": "Mananthiyar Street, Vadakkuvedhi, Vadakumadilagam"},
    {"number": "14", "name": "V.O.C. Street, Shiyama Street, Nadahana Street"},
    {"number": "15", "name": "Kamarajar Street"},
    {"number": "16", "name": "Sannathi Street"},
    {"number": "17", "name": "Cithivinayakar Kovil Street, Madapuram"},
    {"number": "18", "name": "Thirumanjana Veethi"},
    {"number": "19", "name": "Kulunthankulam Keelkarai"},
    {"number": "20", "name": "Alakiri Nagar, Panagal Salai"},
    {"number": "21", "name": "Panagal Salai Area"},
    {"number": "22", "name": "Netaji Salai Area"},
    {"number": "23", "name": "Nagai Road, Senkamettu Street, Sakthi Nagar, Kidarankondan"},
    {"number": "24", "name": "Kamarajar Street, Arshinar Colony, Keelatheru, Kidarankondan"},
    {"number": "25", "name": "Pullatheru, Thanjai Salai"},
    {"number": "26", "name": "Railway Station Road Area"},
    {"number": "27", "name": "Vijayapuram Central"},
    {"number": "28", "name": "Narsingampettai, Thanjavur Road, Vijayapuram"},
    {"number": "29", "name": "Sivan Kovil Street, Alivalam Road, Vijayapuram"},
    {"number": "30", "name": "Kattapomman Street, Srinivasapuram, Vilamal Kadai Street"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Thiruvarur" district
    district_doc = await db.districts.find_one({"name": "Thiruvarur"})
    if not district_doc:
        print("District 'Thiruvarur' not found. Creating it...")
        new_district = {
            "name": "Thiruvarur",
            "code": "TVR",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "thiruvarur@civifix.local",
            "phone": None,
            "address": "Thiruvarur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Thiruvarur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Thiruvarur' with ID: {district_id}")

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
                        "local_body": "Thiruvarur Municipality",
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
                "district": "Thiruvarur",
                "local_body": "Thiruvarur Municipality",
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
