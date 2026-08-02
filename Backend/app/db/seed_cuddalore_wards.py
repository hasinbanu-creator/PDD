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

# Official Cuddalore wards
wards_data = [
    {"number": "01", "name": "Semmandalam Main Road & Manikollai"},
    {"number": "02", "name": "Gundusalai & TNHB Colony"},
    {"number": "03", "name": "Varadarajan Nagar & State Bank Colony"},
    {"number": "04", "name": "Seetharam Nagar Peripheral Extensions"},
    {"number": "05", "name": "Nellikuppam Main Road Border"},
    {"number": "06", "name": "North Semmandalam Residential Line"},
    {"number": "07", "name": "Alpettai Kundusalai & Kamaraj Nagar"},
    {"number": "08", "name": "Municipal Colony & Pennaiyar Road"},
    {"number": "09", "name": "Beach Road Administrative Sector"},
    {"number": "10", "name": "Vannarpalayam Central"},
    {"number": "11", "name": "Lawrence Road Commercial Belt"},
    {"number": "12", "name": "Main Road Manjakkuppam"},
    {"number": "13", "name": "Subraya Chetty District Zone"},
    {"number": "14", "name": "Core Manjakkuppam Residential Lines"},
    {"number": "15", "name": "Institutional & Hospital Environs"},
    {"number": "16", "name": "Thiruppathiripuliyur West"},
    {"number": "17", "name": "Padaleeswarar Temple Sector"},
    {"number": "18", "name": "Car Street & Retail Blocks"},
    {"number": "19", "name": "Subbrayalu Nagar East"},
    {"number": "20", "name": "Anjaneyar Kovil Localities"},
    {"number": "21", "name": "Thiruppathiripuliyur Market Corridor"},
    {"number": "22", "name": "Railway Colony Environs"},
    {"number": "23", "name": "Central Mid-Town Hub"},
    {"number": "24", "name": "Nehru Nagar Extension"},
    {"number": "25", "name": "Kamaraj Salai Junction Blocks"},
    {"number": "26", "name": "Subbrayalu Nagar West"},
    {"number": "27", "name": "Vandipalayam Road Sector"},
    {"number": "28", "name": "Old Town Boundary Confluence"},
    {"number": "29", "name": "Gandhi Nagar Extension"},
    {"number": "30", "name": "Kedilam River South Banks"},
    {"number": "31", "name": "Upper Cuddalore O.T. Blocks"},
    {"number": "32", "name": "Imperial Road North"},
    {"number": "33", "name": "Sonagar Street Coastal Belt"},
    {"number": "34", "name": "Old Town Central Bazaar"},
    {"number": "35", "name": "Singarathope Neighborhoods"},
    {"number": "36", "name": "Kuttaikara Street Core Region"},
    {"number": "37", "name": "Muthu Street Block"},
    {"number": "38", "name": "Palla Street Suburbs"},
    {"number": "39", "name": "Kuttaikara Colony (High-Density)"},
    {"number": "40", "name": "Port Road Commercial Entrance"},
    {"number": "41", "name": "Inward Fishing Harbor Paths"},
    {"number": "42", "name": "Mamsapettai Coastal Quarter"},
    {"number": "43", "name": "Malumiyarpettai Residential Lines"},
    {"number": "44", "name": "Pachaiyanguppam Boundaries"},
    {"number": "45", "name": "Uppalam Road & Port Limits"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Cuddalore" district
    district_doc = await db.districts.find_one({"name": "Cuddalore"})
    if not district_doc:
        print("District 'Cuddalore' not found. Creating it...")
        new_district = {
            "name": "Cuddalore",
            "code": "CUD",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "cuddalore@civifix.local",
            "phone": None,
            "address": "Cuddalore District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Cuddalore' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Cuddalore' with ID: {district_id}")

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
                        "local_body": "Cuddalore Municipality",
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
                "district": "Cuddalore",
                "local_body": "Cuddalore Municipality",
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
