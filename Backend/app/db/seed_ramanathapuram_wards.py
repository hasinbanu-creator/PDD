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

# Official Ramanathapuram wards
wards_data = [
    {"number": "01", "name": "Kolikottu Street & Banumathi Natchiar North Street"},
    {"number": "02", "name": "Muniyandisamikovil South Street (North-West Section)"},
    {"number": "03", "name": "Raja Aranmanai West Street, Throuwpathi Amman Kovil, & Sannathi Street"},
    {"number": "04", "name": "Neelakandioorani North Street & Aranmanai East Street"},
    {"number": "05", "name": "Muniyandisamikovil South Street (South Section)"},
    {"number": "06", "name": "Mariyamman Kovil Street & Sivankovil East Car Street"},
    {"number": "07", "name": "Sannathi Street Central Area"},
    {"number": "08", "name": "Mugavaioorani West Street & Kulanthaisami Santhu"},
    {"number": "09", "name": "Muniasamy Kovil West Street"},
    {"number": "10", "name": "Kottaimedu Area & Big Bazaar Street Boundary"},
    {"number": "11", "name": "Aranmanai South Street & Salai Street Junction"},
    {"number": "12", "name": "Periyar Nagar East"},
    {"number": "13", "name": "Periyar Nagar West"},
    {"number": "14", "name": "Thaiyalkara Street Area"},
    {"number": "15", "name": "Vallalpari North Street"},
    {"number": "16", "name": "Vallalpari South Street"},
    {"number": "17", "name": "Kanthari Amman Kovil Street"},
    {"number": "18", "name": "Fisherman Street Area"},
    {"number": "19", "name": "Patchivalayakara Street (Inner Lanes)"},
    {"number": "20", "name": "Dharpasayana Road Santhu"},
    {"number": "21", "name": "Railway Feeder Road"},
    {"number": "22", "name": "Bharathi Nagar Commercial Stretch"},
    {"number": "23", "name": "Thaiyalbagam Santhu South Street"},
    {"number": "24", "name": "Ponneya Bagavathar South Street & Lathams Bungalow Road"},
    {"number": "25", "name": "Ilangovadigal Street, Semmankundu Street, & NHP Colony"},
    {"number": "26", "name": "Koorisatha Ayyanar Kovil Area & Local Fund Road"},
    {"number": "27", "name": "Agraharam Road Area"},
    {"number": "28", "name": "Gandhi Nagar Area"},
    {"number": "29", "name": "Railway Goodshed Colony (North Section) & Railway Line Path"},
    {"number": "30", "name": "Railway Goodshed Colony (Vellipattinam Main Sector)"},
    {"number": "31", "name": "Patchivalayakara Street (Vellipattinam Outskirts)"},
    {"number": "32", "name": "Pamboorani Road (Vellipattinam)"},
    {"number": "33", "name": "Pulikkara Street (Vellipattinam Boundary)"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Ramanathapuram" district
    district_doc = await db.districts.find_one({"name": "Ramanathapuram"})
    if not district_doc:
        print("District 'Ramanathapuram' not found. Creating it...")
        new_district = {
            "name": "Ramanathapuram",
            "code": "RAM",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "ramanathapuram@civifix.local",
            "phone": None,
            "address": "Ramanathapuram District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Ramanathapuram' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Ramanathapuram' with ID: {district_id}")

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
                        "local_body": "Ramanathapuram Municipality",
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
                "district": "Ramanathapuram",
                "local_body": "Ramanathapuram Municipality",
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
