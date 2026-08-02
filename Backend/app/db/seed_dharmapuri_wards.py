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

# Official Dharmapuri wards (skipping Ward 07 as requested)
wards_data = [
    {"number": "01", "name": "New Thirupathur Road & Mathikonpalayam North"},
    {"number": "02", "name": "Peraman Street & Core Residential Mathikonpalayam"},
    {"number": "03", "name": "Kamatchiamman Street & Inga Gounder Main Road"},
    {"number": "04", "name": "Ameena Kuppusamy Road & Kottai Area Limits"},
    {"number": "05", "name": "Jagerthar Road & Inner Kottai Sectors"},
    {"number": "06", "name": "Central Market Lanes & Bazaar Lines"},
    # 07 is skipped
    {"number": "08", "name": "Pennagaram Main Road, Ambedkar Street, Sivaraji Road, M. Raji Road & Shivaji Road"},
    {"number": "09", "name": "South Railway Line Boundary & Harichandiran Koil Areas"},
    {"number": "10", "name": "Pilliyar Koil Street Sections (West) & Thangavel Street"},
    {"number": "11", "name": "Kumarasamy Pettai Main Road & Surrounding Loops"},
    {"number": "12", "name": "Nethaji Bypass Road Intersections (West Side)"},
    {"number": "13", "name": "Railway Colony Limits & Adjacent Lanes"},
    {"number": "14", "name": "Kandaswamy Vathiyar Street Residential Cluster"},
    {"number": "15", "name": "Appavoo Nagar & Nearby Housing Sectors"},
    {"number": "16", "name": "Salem Main Road Commercial Stretch (Inner City Link)"},
    {"number": "17", "name": "Weavers Colony Clusters & Handloom Sector Pockets"},
    {"number": "18", "name": "Elakkiyampatti Border Lanes (Municipal Side)"},
    {"number": "19", "name": "Teachers Colony Extension Zones"},
    {"number": "20", "name": "Collectorate Perimeter Lanes & Outer Ring Junctions"},
    {"number": "21", "name": "Pidamaneri Road & Pidamaneri Lake Peripheral Streets"},
    {"number": "22", "name": "Gundalapatti Linking Pathways"},
    {"number": "23", "name": "Vennampatti Road Residential Layouts"},
    {"number": "24", "name": "Housing Board Colony Phase Lines"},
    {"number": "25", "name": "Laligam Road Interior Links"},
    {"number": "26", "name": "Oddapatti Boundary Limits"},
    {"number": "27", "name": "Outer Salem Bypass Cross-Streets"},
    {"number": "28", "name": "SV Road Residential Grid"},
    {"number": "29", "name": "Netaji Bypass Eastern Extensions"},
    {"number": "30", "name": "Old Dharmapuri Boundary Layouts"},
    {"number": "31", "name": "Bharathipuram Residential Streets (1st to 5th Cross)"},
    {"number": "32", "name": "Thoppu Street & Central Annasagaram Sectors"},
    {"number": "33", "name": "Pillayar Koil Nadu Veedhi, Chellan Street & Vadakariyan Street (Annasagaram East)"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Dharmapuri" district
    district_doc = await db.districts.find_one({"name": "Dharmapuri"})
    if not district_doc:
        print("District 'Dharmapuri' not found. Creating it...")
        new_district = {
            "name": "Dharmapuri",
            "code": "DPI",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "dharmapuri@civifix.local",
            "phone": None,
            "address": "Dharmapuri District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Dharmapuri' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Dharmapuri' with ID: {district_id}")

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
                        "local_body": "Dharmapuri Municipality",
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
                "district": "Dharmapuri",
                "local_body": "Dharmapuri Municipality",
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
