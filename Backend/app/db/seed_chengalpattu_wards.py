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

# Official Chengalpattu wards
wards_data = [
    {"number": "01", "name": "Kancheepuram Highroad Area"},
    {"number": "02", "name": "Sundharamoorthy Vinayagar Kovil Street"},
    {"number": "03", "name": "Chinnamman Kovil Street"},
    {"number": "04", "name": "Yakoopsahip Street"},
    {"number": "05", "name": "Kaathan Street (Natham Post)"},
    {"number": "06", "name": "Periya Natham (Osur Amman Kovil Street)"},
    {"number": "07", "name": "Sundara Vinayagar Kovil Neighborhood"},
    {"number": "08", "name": "J.C.K. Nagar Area"},
    {"number": "09", "name": "Mettu Street / Hanumantha Putheri Localities"},
    {"number": "10", "name": "Natham Chengalpattu Residential Blocks"},
    {"number": "11", "name": "Alagesa Nagar Central"},
    {"number": "12", "name": "Vedachalam College Layout Areas"},
    {"number": "13", "name": "Bharathiyar Street Neighborhoods"},
    {"number": "14", "name": "Old G.S.T Road Blocks"},
    {"number": "15", "name": "Pudu Hospital and Medical College Zone"},
    {"number": "16", "name": "Ramapaliam Street Sectors"},
    {"number": "17", "name": "Hanumantha Putheri Extension"},
    {"number": "18", "name": "Gokulapuram Layouts"},
    {"number": "19", "name": "Thattanmalai Street Areas"},
    {"number": "20", "name": "JCK Nagar Main Extension"},
    {"number": "21", "name": "Thirupur Kumaran Street Neighborhoods"},
    {"number": "22", "name": "Azhagesan Nagar Main Blocks"},
    {"number": "23", "name": "Station Road / Railway Colony Corridor"},
    {"number": "24", "name": "Fire Service and Sub-Collector Office Enclaves"},
    {"number": "25", "name": "9th Cross Street (Anna Nagar)"},
    {"number": "26", "name": "Bharathiyar Street Extension"},
    {"number": "27", "name": "Azhagesan Nagar Extension Layouts"},
    {"number": "28", "name": "Chengalpattu Outer Ring Residential Zones"},
    {"number": "29", "name": "Satellite Highway Bordering Communities"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Chengalpattu" district
    district_doc = await db.districts.find_one({"name": "Chengalpattu"})
    if not district_doc:
        print("District 'Chengalpattu' not found. Creating it...")
        new_district = {
            "name": "Chengalpattu",
            "code": "CGL",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "chengalpattu@civifix.local",
            "phone": None,
            "address": "Chengalpattu District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Chengalpattu' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Chengalpattu' with ID: {district_id}")

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
                "district": "Chengalpattu",
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
