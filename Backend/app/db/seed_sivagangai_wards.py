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

# Official Sivagangai wards
wards_data = [
    {"number": "01", "name": "Pothigai Nagar"},
    {"number": "02", "name": "Gohale Hall Main Street"},
    {"number": "03", "name": "Marudhupandiyar Nagar (Tamil Nadu Housing Board Complex)"},
    {"number": "04", "name": "Neethipathi Rajasekaran Street"},
    {"number": "05", "name": "Gohale Hall Main Street Area"},
    {"number": "06", "name": "Bhagavatsingh Street"},
    {"number": "07", "name": "Sastri 5th Street"},
    {"number": "08", "name": "Kamatchiyamman Kovil Street"},
    {"number": "09", "name": "Kamatchiyamman Kovil Cross Street"},
    {"number": "10", "name": "Kumaramangalam Street"},
    {"number": "11", "name": "Bose Road (1st Cross Street)"},
    {"number": "12", "name": "Pudhur Road"},
    {"number": "13", "name": "Krishna Layout"},
    {"number": "14", "name": "Majith Road (3rd Cross Street)"},
    {"number": "15", "name": "Majith Road (1st Cross Street)"},
    {"number": "16", "name": "Shahul Hameed Street"},
    {"number": "17", "name": "North Raja Veethi"},
    {"number": "18", "name": "Bharathi Nagar (4th Street)"},
    {"number": "19", "name": "Nelmandi Street"},
    {"number": "20", "name": "Indira Nagar (2nd Street)"},
    {"number": "21", "name": "Asath Street"},
    {"number": "22", "name": "Manickavasagar Street"},
    {"number": "23", "name": "Pettai Street"},
    {"number": "24", "name": "Ilango Street (Melavaniyankudi / Kamarajar Salai)"},
    {"number": "25", "name": "Akilandapuram"},
    {"number": "26", "name": "Ilayankudi Salai East (Indira Nagar Area)"},
    {"number": "27", "name": "Indira Nagar West / Ilayangudi Salai Main"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Sivagangai" district
    district_doc = await db.districts.find_one({"name": "Sivagangai"})
    if not district_doc:
        print("District 'Sivagangai' not found. Creating it...")
        new_district = {
            "name": "Sivagangai",
            "code": "SVG",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "sivagangai@civifix.local",
            "phone": None,
            "address": "Sivagangai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Sivagangai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Sivagangai' with ID: {district_id}")

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
                        "local_body": "Sivagangai Municipality",
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
                "district": "Sivagangai",
                "local_body": "Sivagangai Municipality",
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
