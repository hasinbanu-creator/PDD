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

# Official Virudhunagar wards
wards_data = [
    {"number": "01", "name": "East Pandiyan Colony & Baranginathapuram Main Road Area"},
    {"number": "02", "name": "Sivan Kovil Street & Bypass Main Road Cluster"},
    {"number": "03", "name": "Parapatti Street, Pulugarooni Road & Pullalakottai Road"},
    {"number": "04", "name": "Kacheri Road, Kandhapuram Street & Malapettai Street"},
    {"number": "05", "name": "Neruji Nagar Central Residential Sector"},
    {"number": "06", "name": "Indira Nagar East & Pullalakottai Road Intersection"},
    {"number": "07", "name": "Indira Nagar North & Surrounding Extensions"},
    {"number": "08", "name": "Palpandi Street Residential Sector"},
    {"number": "09", "name": "Madurai Road Commercial Zone & Surrounding Streets"},
    {"number": "10", "name": "Agragaram Street Zone"},
    {"number": "11", "name": "Pitchai Street Locality"},
    {"number": "12", "name": "Old Bus Stand Commercial Ring"},
    {"number": "13", "name": "S.V.P.N. Street Neighborhood"},
    {"number": "14", "name": "Patel Road Sector"},
    {"number": "15", "name": "Allampatti Main Road Corridor"},
    {"number": "16", "name": "Allampatti Extension Colony"},
    {"number": "17", "name": "Chinna Moopanpatti Northern Sector"},
    {"number": "18", "name": "Chinna Moopanpatti Core Residential Area"},
    {"number": "19", "name": "Kottaipatti Village Boundary Limits"},
    {"number": "20", "name": "Kottaipatti Housing Sectors"},
    {"number": "21", "name": "Muthuramanpatti Southern Residential Cluster"},
    {"number": "22", "name": "Muthuramanpatti Extension Layout"},
    {"number": "23", "name": "Railway Feeder Road Station Area"},
    {"number": "24", "name": "Sulakarai Industrial Estate Residential Fringe"},
    {"number": "25", "name": "Bazaar Area Primary Retail Zone"},
    {"number": "26", "name": "Mariamman Kovil Street Zone"},
    {"number": "27", "name": "S.P.N. Chidambaram Street & Kamalapatchaiappan Street Area"},
    {"number": "28", "name": "Marikani Street Sector"},
    {"number": "29", "name": "Jawahar Bazaar Commercial Avenue"},
    {"number": "30", "name": "Kooraikundu Local Boundary Streets"},
    {"number": "31", "name": "Meenachipuram Residential Sector"},
    {"number": "32", "name": "Kattayapuram Central Sector"},
    {"number": "33", "name": "Avalappasamy Koil Street (Kattayapuram)"},
    {"number": "34", "name": "Moonchimada Koil Street & Fathima Nagar Area"},
    {"number": "35", "name": "Sivanthipuram 14th Street Residential Hub"},
    {"number": "36", "name": "Sankaranarayanapuram Street Layout"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Virudhunagar" district
    district_doc = await db.districts.find_one({"name": "Virudhunagar"})
    if not district_doc:
        print("District 'Virudhunagar' not found. Creating it...")
        new_district = {
            "name": "Virudhunagar",
            "code": "VDN",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "virudhunagar@civifix.local",
            "phone": None,
            "address": "Virudhunagar District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Virudhunagar' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Virudhunagar' with ID: {district_id}")

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
                        "local_body": "Virudhunagar Municipality",
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
                "district": "Virudhunagar",
                "local_body": "Virudhunagar Municipality",
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
