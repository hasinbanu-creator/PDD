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

# Official Nagapattinam wards
wards_data = [
    {"number": "01", "name": "Shivan Sannathi, Nagore"},
    {"number": "02", "name": "Miyan Street, Nagore"},
    {"number": "03", "name": "Theruppalli, Nagore"},
    {"number": "04", "name": "Ariyanattu South Street, Pattinacherry, Nagore"},
    {"number": "05", "name": "Kadarsha Maraikkayar Street, Nagore"},
    {"number": "06", "name": "Mariamman Koil Lane, Nagore"},
    {"number": "07", "name": "Thirumalaiyappan Lane, Nagore"},
    {"number": "08", "name": "Perumal Kulam Melkarai, Nagore"},
    {"number": "09", "name": "Thaikkal Street, Kollam Street, Nagore"},
    {"number": "10", "name": "Cholera Street, Nagore"},
    {"number": "11", "name": "Amirthanagar, Samanthanpettai"},
    {"number": "12", "name": "Keela Street, North Palpannaichery"},
    {"number": "13", "name": "Mariamman Kovil Sannathi, South Palpannaichery"},
    {"number": "14", "name": "Pachaipillaiyar Kovil Street, Velippalayam"},
    {"number": "15", "name": "Main Road, Kadambadi"},
    {"number": "16", "name": "Amman Kovil Street, Nambiyar Nagar"},
    {"number": "17", "name": "Nadar Street, Velipalayam"},
    {"number": "18", "name": "Muthumariamman Kovil Street, Velipalayam"},
    {"number": "19", "name": "Ramarmada South Street, Velipalayam"},
    {"number": "20", "name": "Nadukkan Tirtha Vinayaga Sannathi Street"},
    {"number": "21", "name": "Thamaraikulam Thenkarai, Velipalayam"},
    {"number": "22", "name": "VOC Street"},
    {"number": "23", "name": "Cooks Road, Velipalayam"},
    {"number": "24", "name": "Vedanayakam Chetty Street"},
    {"number": "25", "name": "Semarakkadai Keel Santhu"},
    {"number": "26", "name": "Kottupalaiyam Street, Ramarmada Lane"},
    {"number": "27", "name": "Thandavarayapillai Street"},
    {"number": "28", "name": "Neela Keela Veethi"},
    {"number": "29", "name": "Kathef Lepbai Street"},
    {"number": "30", "name": "Yanaikatti Mudukku Lane, Perumal North Road"},
    {"number": "31", "name": "Yanaikatti Mudukku Lane"},
    {"number": "32", "name": "Sattaiyappar Kovil Mela Veethi"},
    {"number": "33", "name": "Akkaraikulam Thenkarai"},
    {"number": "34", "name": "Keeraikollai Street"},
    {"number": "35", "name": "Old Sevabharathi, Salt Road"},
    {"number": "36", "name": "Tata Nagar"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Nagapattinam" district
    district_doc = await db.districts.find_one({"name": "Nagapattinam"})
    if not district_doc:
        print("District 'Nagapattinam' not found. Creating it...")
        new_district = {
            "name": "Nagapattinam",
            "code": "NGP",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "nagapattinam@civifix.local",
            "phone": None,
            "address": "Nagapattinam District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Nagapattinam' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Nagapattinam' with ID: {district_id}")

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
                        "local_body": "Nagapattinam Municipality",
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
                "district": "Nagapattinam",
                "local_body": "Nagapattinam Municipality",
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
