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

from app.db.indexes import create_indexes

# Official Chennai wards (Wards 1 to 50)
wards_data = [
    {"number": 1, "name": "Kathivakkam", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 2, "name": "Ennore", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 3, "name": "Ernavoor", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 4, "name": "Ajax", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 5, "name": "Tiruvottiyur", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 6, "name": "Kaladipet", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 7, "name": "Rajakadai", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 8, "name": "Thiruvottiyur West", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 9, "name": "Jothiramalingam Nagar", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 10, "name": "Theradi", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 11, "name": "Mattankuppam", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 12, "name": "Varadharajaperumal Nagar", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 13, "name": "Sathangadu", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 14, "name": "Tollgate", "zone": "Zone 1: Thiruvottiyur"},
    {"number": 15, "name": "Edayanchavadi", "zone": "Zone 2: Manali"},
    {"number": 16, "name": "Sadayankuppam", "zone": "Zone 2: Manali"},
    {"number": 17, "name": "Kadapakkam", "zone": "Zone 2: Manali"},
    {"number": 18, "name": "Theeyampakkam", "zone": "Zone 2: Manali"},
    {"number": 19, "name": "Manali", "zone": "Zone 2: Manali"},
    {"number": 20, "name": "Mathur", "zone": "Zone 2: Manali"},
    {"number": 21, "name": "Kosapur", "zone": "Zone 2: Manali"},
    {"number": 22, "name": "Kavankarai", "zone": "Zone 3: Madhavaram"},
    {"number": 23, "name": "Puzhal", "zone": "Zone 3: Madhavaram"},
    {"number": 24, "name": "Puthagaram", "zone": "Zone 3: Madhavaram"},
    {"number": 25, "name": "Kathirvedu", "zone": "Zone 3: Madhavaram"},
    {"number": 26, "name": "Lakshmipuram", "zone": "Zone 3: Madhavaram"},
    {"number": 27, "name": "Vinayakapuram", "zone": "Zone 3: Madhavaram"},
    {"number": 28, "name": "Assisi Nagar", "zone": "Zone 3: Madhavaram"},
    {"number": 29, "name": "Chinnasekkadu", "zone": "Zone 3: Madhavaram"},
    {"number": 30, "name": "Madhavaram West", "zone": "Zone 3: Madhavaram"},
    {"number": 31, "name": "Madhavaram East", "zone": "Zone 3: Madhavaram"},
    {"number": 32, "name": "Ponniammanmedu", "zone": "Zone 3: Madhavaram"},
    {"number": 33, "name": "Kumaran Nagar", "zone": "Zone 3: Madhavaram"},
    {"number": 34, "name": "Kodungaiyur", "zone": "Zone 4: Tondiarpet"},
    {"number": 35, "name": "Kodungaiyur East", "zone": "Zone 4: Tondiarpet"},
    {"number": 36, "name": "Erukkencherry", "zone": "Zone 4: Tondiarpet"},
    {"number": 37, "name": "Kaviarasu Kannadasan Nagar", "zone": "Zone 4: Tondiarpet"},
    {"number": 38, "name": "Tondiarpet East", "zone": "Zone 4: Tondiarpet"},
    {"number": 39, "name": "Tondiarpet", "zone": "Zone 4: Tondiarpet"},
    {"number": 40, "name": "New Washermenpet", "zone": "Zone 4: Tondiarpet"},
    {"number": 41, "name": "Tollgate South", "zone": "Zone 4: Tondiarpet"},
    {"number": 42, "name": "Old Washermenpet", "zone": "Zone 4: Tondiarpet"},
    {"number": 43, "name": "Korukkupet", "zone": "Zone 4: Tondiarpet"},
    {"number": 44, "name": "Stanley Nagar", "zone": "Zone 4: Tondiarpet"},
    {"number": 45, "name": "Perambur North", "zone": "Zone 4: Tondiarpet"},
    {"number": 46, "name": "Vyasarpadi", "zone": "Zone 4: Tondiarpet"},
    {"number": 47, "name": "Vyasarpadi Central", "zone": "Zone 4: Tondiarpet"},
    {"number": 48, "name": "Vyasarpadi South", "zone": "Zone 4: Tondiarpet"},
    {"number": 49, "name": "Royapuram", "zone": "Zone 5: Royapuram"},
    {"number": 50, "name": "Mint", "zone": "Zone 5: Royapuram"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Chennai" district
    district_doc = await db.districts.find_one({"name": "Chennai"})
    if not district_doc:
        print("District 'Chennai' not found. Creating it...")
        new_district = {
            "name": "Chennai",
            "code": "CHN",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "chennai@civifix.local",
            "phone": None,
            "address": "Chennai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Chennai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Chennai' with ID: {district_id}")

    # 2. Delete old ward records for Greater Chennai Corporation
    print("Deleting old ward records for Greater Chennai Corporation...")
    del_res = await db.wards.delete_many({
        "district_id": district_id,
        "local_body": "Greater Chennai Corporation"
    })
    print(f"Deleted {del_res.deleted_count} old ward records.")

    # 3. Seed/insert wards
    inserted_count = 0
    
    for w in wards_data:
        ward_num = w["number"]
        ward_name = w["name"]
        zone = w["zone"]
        display_name = f"Ward {ward_num} - {ward_name}"
        
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
            
    print(f"\nSeeding summary: {inserted_count} wards inserted successfully.")
    
    print("\nEnsuring all MongoDB indexes are created...")
    await create_indexes(db)
    print("Indexes created.")

if __name__ == "__main__":
    asyncio.run(seed())
