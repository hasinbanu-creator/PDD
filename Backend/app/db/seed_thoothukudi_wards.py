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

# Official Thoothukudi wards
wards_data = [
    {"number": "01", "name": "Pandarampatti (West Street)"},
    {"number": "02", "name": "Muthammal Colony (7th Street)"},
    {"number": "03", "name": "Sankaraperi (Housing Board)"},
    {"number": "04", "name": "Sathya Nagar & Sundaravelpuram West"},
    {"number": "05", "name": "Krishnarajapuram"},
    {"number": "06", "name": "Ponsubbaiah Nagar"},
    {"number": "07", "name": "Threspuram Proper"},
    {"number": "08", "name": "Mathavarayar Colony (Threspuram)"},
    {"number": "09", "name": "Boobalarayerpuram (4th Street)"},
    {"number": "10", "name": "Krishnarajapuram (7th Street)"},
    {"number": "11", "name": "Sakthivinayagarpuram"},
    {"number": "12", "name": "Polepettai West"},
    {"number": "13", "name": "Polepettai East"},
    {"number": "14", "name": "Muthukrishna Nagar"},
    {"number": "15", "name": "Rajagopal Nagar"},
    {"number": "16", "name": "Tooveypuram North"},
    {"number": "17", "name": "Kurinchi Nagar"},
    {"number": "18", "name": "P&T Colony"},
    {"number": "19", "name": "Meenachipuram"},
    {"number": "20", "name": "Tooveypuram (Central)"},
    {"number": "21", "name": "Natarajapuram"},
    {"number": "22", "name": "Muthukrishnapuram"},
    {"number": "23", "name": "Boopalarayarpuram Coastal Area"},
    {"number": "24", "name": "Cruzpuram"},
    {"number": "25", "name": "Thattar Street"},
    {"number": "26", "name": "North Nainarvillai"},
    {"number": "27", "name": "Muniyasamy Kovil Area"},
    {"number": "28", "name": "Meenachipuram East"},
    {"number": "29", "name": "Tooveypuram South"},
    {"number": "30", "name": "Tooveypuram (2nd Street)"},
    {"number": "31", "name": "Anna Nagar (8th Street)"},
    {"number": "32", "name": "Anna Nagar (4th Street)"},
    {"number": "33", "name": "Millerpuram Central"},
    {"number": "34", "name": "Ashok Nagar (8th Street)"},
    {"number": "35", "name": "Subbaiyapuram"},
    {"number": "36", "name": "Pudhugramam"},
    {"number": "37", "name": "Dhamothara Nagar"},
    {"number": "38", "name": "Jailani Street"},
    {"number": "39", "name": "South Cotton Road North"},
    {"number": "40", "name": "South Cotton Road South"},
    {"number": "41", "name": "Shanmugapuram Proper"},
    {"number": "42", "name": "Vannar Street (Melashanmugapuram)"},
    {"number": "43", "name": "Muniasamypuram Extension & New Colony"},
    {"number": "44", "name": "Bryant Nagar East (7th Street)"},
    {"number": "45", "name": "Levinjipuram (1st Street)"},
    {"number": "46", "name": "Fathima Nagar & George Road"},
    {"number": "47", "name": "South Cotton Road Extension"},
    {"number": "48", "name": "Caldwell Colony (1st Street West)"},
    {"number": "49", "name": "Bryant Nagar West"},
    {"number": "50", "name": "Chidambaranagar"},
    {"number": "51", "name": "State Bank Colony"},
    {"number": "52", "name": "KVK Nagar"},
    {"number": "53", "name": "Third Mile Area"},
    {"number": "54", "name": "Thermal Nagar"},
    {"number": "55", "name": "Camp II Area"},
    {"number": "56", "name": "Bharathi Nagar (1st Street, Muthaiahpuram)"},
    {"number": "57", "name": "West Amman Kovil Street (Saveriyarpuram)"},
    {"number": "58", "name": "Rajiv Nagar (7th Street, Muthaiahpuram)"},
    {"number": "59", "name": "Millerpuram (2nd Street, Palai Road West)"},
    {"number": "60", "name": "Muthammal Colony South"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Thoothukudi" district
    district_doc = await db.districts.find_one({"name": "Thoothukudi"})
    if not district_doc:
        print("District 'Thoothukudi' not found. Creating it...")
        new_district = {
            "name": "Thoothukudi",
            "code": "TUT",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "thoothukudi@civifix.local",
            "phone": None,
            "address": "Thoothukudi District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Thoothukudi' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Thoothukudi' with ID: {district_id}")

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
                        "local_body": "Thoothukudi City Municipal Corporation",
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
                "district": "Thoothukudi",
                "local_body": "Thoothukudi City Municipal Corporation",
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
