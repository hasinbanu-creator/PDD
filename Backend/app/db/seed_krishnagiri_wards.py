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

# Official Krishnagiri wards
wards_data = [
    {"number": "01", "name": "Fort, Old Pet (Hajji Jalludeen Street)"},
    {"number": "02", "name": "Old Pet (Chella Munisamy Street)"},
    {"number": "03", "name": "Old Pet (Ismail Street)"},
    {"number": "04", "name": "Old Pet (Thanjavur Mariamman Koil Street)"},
    {"number": "05", "name": "New Pet (Bejanai Koil Street)"},
    {"number": "06", "name": "Arunthathi Mariamman Koil Street"},
    {"number": "07", "name": "Londonpet"},
    {"number": "08", "name": "Veerapan Nagar"},
    {"number": "09", "name": "Old Pet (Fathima Nagar)"},
    {"number": "10", "name": "Old Pet (Nallathambi Street)"},
    {"number": "11", "name": "Anna Nagar (Ponthottam)"},
    {"number": "12", "name": "Gandhi Road (603-A Block Area)"},
    {"number": "13", "name": "Gandhi Road (258 Block Area)"},
    {"number": "14", "name": "Veerappa Nagar (1st Cross)"},
    {"number": "15", "name": "Gandhi Nagar (D. Basheer Mohamed Layout)"},
    {"number": "16", "name": "Londonpet"},
    {"number": "17", "name": "Shanthi Nagar (1st Cross Street)"},
    {"number": "18", "name": "Jakkappan Nagar (8th Cross)"},
    {"number": "19", "name": "Thammanna Nagar (2nd Cross)"},
    {"number": "20", "name": "Colony West Junction Road"},
    {"number": "21", "name": "R.S. Lakshmipuram"},
    {"number": "22", "name": "Periyasamy Street"},
    {"number": "23", "name": "Banakra Street"},
    {"number": "24", "name": "Chennai Salai / Karanji Street"},
    {"number": "25", "name": "Salem Road / Kuppannan Street"},
    {"number": "26", "name": "New Pet (Amsa Hussain Street)"},
    {"number": "27", "name": "New Pet (Nesavukara Street / Colony East)"},
    {"number": "28", "name": "New Pet (Vakkil Krishnamoorthy Street / P.T.V Colony)"},
    {"number": "29", "name": "Vinayaga Street"},
    {"number": "30", "name": "New Pet (Dhasaratharam Street / Old TNHB / NGGO Colony)"},
    {"number": "31", "name": "Amsa Hussain Street / Police Colony"},
    {"number": "32", "name": "Salem Main Road (Avvai Nagar)"},
    {"number": "33", "name": "Dr. Ambedkar Nagar / Keal Somarpet"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Krishnagiri" district
    district_doc = await db.districts.find_one({"name": "Krishnagiri"})
    if not district_doc:
        print("District 'Krishnagiri' not found. Creating it...")
        new_district = {
            "name": "Krishnagiri",
            "code": "KRI",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "krishnagiri@civifix.local",
            "phone": None,
            "address": "Krishnagiri District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Krishnagiri' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Krishnagiri' with ID: {district_id}")

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
                        "local_body": "Krishnagiri Municipality",
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
                "district": "Krishnagiri",
                "local_body": "Krishnagiri Municipality",
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
