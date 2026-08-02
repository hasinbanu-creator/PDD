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

# Official Theni wards
wards_data = [
    {"number": "01", "name": "Main North Street, Bommayagoundanpatti, Nehrugi Road"},
    {"number": "02", "name": "Chinnappan Street, Bommayagoundanpatti, Chellandi Street"},
    {"number": "03", "name": "Kabilar Street, Allinagaram, Municipal Colony Backside, Balan Nagar"},
    {"number": "04", "name": "High School Street, Allinagaram"},
    {"number": "05", "name": "Machal Street, Allinagaram"},
    {"number": "06", "name": "North Saavadi Street, Allinagaram"},
    {"number": "07", "name": "Ambedkar South Street, Allinagaram"},
    {"number": "08", "name": "Ambedkar North Street and Adjacent Layout Blocks"},
    {"number": "09", "name": "Nehruji Road (Central Business Segments)"},
    {"number": "10", "name": "Uppunoothu Street Residential Zone"},
    {"number": "11", "name": "Agraharam Street and Traditional Residential Squares"},
    {"number": "12", "name": "Perumal Kovil Neighborhood Lines"},
    {"number": "13", "name": "Pari Street Layout Sectors"},
    {"number": "14", "name": "Chinnamayathevar Street Corridors"},
    {"number": "15", "name": "Karuvelnayakanpatti Residential Limits"},
    {"number": "16", "name": "Karuvelnayakanpatti North Extension Zones"},
    {"number": "17", "name": "Nallakaruppanpatti Pathway Extensions"},
    {"number": "18", "name": "Forest Road Boundary Colonies"},
    {"number": "19", "name": "Palanichettypatti Highway Interface Blocks"},
    {"number": "20", "name": "Subban Street Residential Zones"},
    {"number": "21", "name": "Periyakulam Road Commercial Corridor Zones"},
    {"number": "22", "name": "N.S.K. Street Central Lines"},
    {"number": "23", "name": "Railway Station Road Boundary Blocks"},
    {"number": "24", "name": "Madurai Road Main Commercial Sectors"},
    {"number": "25", "name": "Bungalow Medu Residential Extensions"},
    {"number": "26", "name": "Barenji Nagar Sectors"},
    {"number": "27", "name": "Old Bus Stand Commercial Ring Limits"},
    {"number": "28", "name": "Edamal Street Alignment Areas"},
    {"number": "29", "name": "Kamarajar Nagar Expansion Sectors"},
    {"number": "30", "name": "Mullai Nagar Housing Colonies"},
    {"number": "31", "name": "Kurinji Nagar Layout Zones"},
    {"number": "32", "name": "Vasuki Colony Extension Limits"},
    {"number": "33", "name": "Vasuki Colony Main Street, Muthuramalingam Streets (1st to 4th), and Thiruvalluvar Colony"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Theni" district
    district_doc = await db.districts.find_one({"name": "Theni"})
    if not district_doc:
        print("District 'Theni' not found. Creating it...")
        new_district = {
            "name": "Theni",
            "code": "TEN",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "theni@civifix.local",
            "phone": None,
            "address": "Theni District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Theni' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Theni' with ID: {district_id}")

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
                        "local_body": "Theni-Allinagaram Municipality",
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
                "district": "Theni",
                "local_body": "Theni-Allinagaram Municipality",
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
