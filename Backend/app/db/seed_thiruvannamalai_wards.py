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

# Official Thiruvannamalai wards
wards_data = [
    {"number": "01", "name": "Polur Road 7th Street & nearby areas"},
    {"number": "02", "name": "Dr. Ambedkar Street & Nochchimalai boundary"},
    {"number": "03", "name": "Vediyappanur Salai & Kottangal areas"},
    {"number": "04", "name": "Muthuvinayagar Kovil Street"},
    {"number": "05", "name": "Puthuvanyankulam Street 1"},
    {"number": "06", "name": "Puthuvanyankulam Street"},
    {"number": "07", "name": "Jonakariparai Street"},
    {"number": "08", "name": "Varthakar Street (Chetty Street)"},
    {"number": "09", "name": "Thyagi Annamalai Nagar"},
    {"number": "10", "name": "Vediyappan Kovil Street"},
    {"number": "11", "name": "Arumuganar Street & Car Street boundary"},
    {"number": "12", "name": "Kattabomman Street & Krishnan Cross Streets"},
    {"number": "13", "name": "Avarankattu Street"},
    {"number": "14", "name": "Then Othavadai Street & Government Hospital zone"},
    {"number": "15", "name": "Thiruvoodal Street"},
    {"number": "16", "name": "Pavazhakundur & Vada Ayyankula Agaraharam"},
    {"number": "17", "name": "Ramalinganar 3rd Street"},
    {"number": "18", "name": "Vediyappan Kovil 1st Street"},
    {"number": "19", "name": "Kilnathur central area"},
    {"number": "20", "name": "Kamaraj Nagar"},
    {"number": "21", "name": "Azeez Colony"},
    {"number": "22", "name": "Samuthiram Colony"},
    {"number": "23", "name": "Arasamara Street & Earpagaiyar Street"},
    {"number": "24", "name": "VOC Nagar 8th Street"},
    {"number": "25", "name": "Earikarai Street (Samuthiram)"},
    {"number": "26", "name": "Ramana Nagar (Chengam Road)"},
    {"number": "27", "name": "Murugar Kovil Street"},
    {"number": "28", "name": "Thamarai Nagar (LIG Area)"},
    {"number": "29", "name": "Chengam Road 2nd Street"},
    {"number": "30", "name": "Patel Abdul Rasak Street"},
    {"number": "31", "name": "Ellukuttai Street"},
    {"number": "32", "name": "Thenimalai (Murugar Kovil Street)"},
    {"number": "33", "name": "Kal Nagar & Mariyamman Koil 12th Street"},
    {"number": "34", "name": "Mariyamman Kovil 9th Street"},
    {"number": "35", "name": "Mariyamman Kovil Street"},
    {"number": "36", "name": "Kal Nagar residential lanes"},
    {"number": "37", "name": "Mugulpura Street"},
    {"number": "38", "name": "Puthumettu Street"},
    {"number": "39", "name": "Bharathi Nagar (Thirukovilur Salai) & Vettavalam Road"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Thiruvannamalai" district
    district_doc = await db.districts.find_one({"name": "Thiruvannamalai"})
    if not district_doc:
        print("District 'Thiruvannamalai' not found. Creating it...")
        new_district = {
            "name": "Thiruvannamalai",
            "code": "TVM",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "thiruvannamalai@civifix.local",
            "phone": None,
            "address": "Thiruvannamalai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Thiruvannamalai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Thiruvannamalai' with ID: {district_id}")

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
                        "local_body": "Thiruvannamalai Municipality",
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
                "district": "Thiruvannamalai",
                "local_body": "Thiruvannamalai Municipality",
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
