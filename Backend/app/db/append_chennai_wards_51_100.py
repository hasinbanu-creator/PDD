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

# Chennai wards (Wards 51 to 100)
wards_data = [
    {"number": 51, "name": "Basin Bridge", "zone": "Zone 5: Royapuram"},
    {"number": 52, "name": "Kondithoppu", "zone": "Zone 5: Royapuram"},
    {"number": 53, "name": "George Town", "zone": "Zone 5: Royapuram"},
    {"number": 54, "name": "Broadway", "zone": "Zone 5: Royapuram"},
    {"number": 55, "name": "Elephant Gate", "zone": "Zone 5: Royapuram"},
    {"number": 56, "name": "Park Town", "zone": "Zone 5: Royapuram"},
    {"number": 57, "name": "Sowcarpet", "zone": "Zone 5: Royapuram"},
    {"number": 58, "name": "Central", "zone": "Zone 5: Royapuram"},
    {"number": 59, "name": "Choolai", "zone": "Zone 5: Royapuram"},
    {"number": 60, "name": "Periamet", "zone": "Zone 5: Royapuram"},
    {"number": 61, "name": "Purasaiwakkam", "zone": "Zone 5: Royapuram"},
    {"number": 62, "name": "Vepery", "zone": "Zone 5: Royapuram"},
    {"number": 63, "name": "Anna Salai / Chepauk", "zone": "Zone 5: Royapuram"},
    {"number": 64, "name": "Kolathur", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 65, "name": "Kunnur / Peravallur", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 66, "name": "Peravallur East", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 67, "name": "Villivakkam North", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 68, "name": "Sembium", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 69, "name": "Perambur West", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 70, "name": "Perambur South", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 71, "name": "Vyasarpadi West", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 72, "name": "Jamaliya", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 73, "name": "Mettupalayam", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 74, "name": "Otteri", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 75, "name": "Ayanavaram", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 76, "name": "Pulianthope", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 77, "name": "Pattalam", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 78, "name": "Kosapet / Kilpauk", "zone": "Zone 6: Thiru-Vi-Ka Nagar"},
    {"number": 79, "name": "Lenin Nagar", "zone": "Zone 7: Ambattur"},
    {"number": 80, "name": "Oragadam", "zone": "Zone 7: Ambattur"},
    {"number": 81, "name": "Surapet", "zone": "Zone 7: Ambattur"},
    {"number": 82, "name": "Kathirvedu South", "zone": "Zone 7: Ambattur"},
    {"number": 83, "name": "Korattur North", "zone": "Zone 7: Ambattur"},
    {"number": 84, "name": "Korattur", "zone": "Zone 7: Ambattur"},
    {"number": 85, "name": "Padi", "zone": "Zone 7: Ambattur"},
    {"number": 86, "name": "Ambattur East", "zone": "Zone 7: Ambattur"},
    {"number": 87, "name": "Ambattur West", "zone": "Zone 7: Ambattur"},
    {"number": 88, "name": "Venkatapuram", "zone": "Zone 7: Ambattur"},
    {"number": 89, "name": "Mugappair North", "zone": "Zone 7: Ambattur"},
    {"number": 90, "name": "Mugappair West", "zone": "Zone 7: Ambattur"},
    {"number": 91, "name": "Mannurpet", "zone": "Zone 7: Ambattur"},
    {"number": 92, "name": "Mogappair East", "zone": "Zone 7: Ambattur"},
    {"number": 93, "name": "Nolambur", "zone": "Zone 7: Ambattur"},
    {"number": 94, "name": "Villivakkam South", "zone": "Zone 8: Anna Nagar"},
    {"number": 95, "name": "Padi South", "zone": "Zone 8: Anna Nagar"},
    {"number": 96, "name": "Anna Nagar West", "zone": "Zone 8: Anna Nagar"},
    {"number": 97, "name": "Anna Nagar North", "zone": "Zone 8: Anna Nagar"},
    {"number": 98, "name": "Aminjikarai West", "zone": "Zone 8: Anna Nagar"},
    {"number": 99, "name": "Kilpauk Garden", "zone": "Zone 8: Anna Nagar"},
    {"number": 100, "name": "Shenoy Nagar", "zone": "Zone 8: Anna Nagar"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve "Chennai" district
    district_doc = await db.districts.find_one({"name": "Chennai"})
    assert district_doc, "District 'Chennai' must exist!"
    district_id = district_doc["_id"]
    print(f"Found District 'Chennai' with ID: {district_id}")

    # 2. Append/update wards (Wards 51 to 100)
    inserted_count = 0
    updated_count = 0
    
    for w in wards_data:
        ward_num = w["number"]
        ward_name = w["name"]
        zone = w["zone"]
        display_name = f"Ward {ward_num} - {ward_name}"
        
        # Check if ward already exists
        existing_ward = await db.wards.find_one({
            "district_id": district_id,
            "ward_number": ward_num
        })
        
        if existing_ward:
            await db.wards.update_one(
                {"_id": existing_ward["_id"]},
                {
                    "$set": {
                        "ward_name": ward_name,
                        "zone": zone,
                        "display_name": display_name,
                        "label": display_name,
                        "description": display_name,
                        "local_body": "Greater Chennai Corporation",
                        "is_active": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            print(f"Updated existing Ward: {display_name}")
            updated_count += 1
        else:
            new_ward = {
                "district": "Chennai",
                "local_body": "Greater Chennai Corporation",
                "district_id": district_id,
                "ward_name": ward_name,
                "ward_number": ward_num,
                "zone": zone,
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
            print(f"Inserted Ward: {display_name} ({zone})")
            inserted_count += 1
            
    print(f"\nAppending summary: {inserted_count} wards inserted, {updated_count} wards updated.")

if __name__ == "__main__":
    asyncio.run(seed())
