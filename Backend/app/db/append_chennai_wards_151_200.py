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

# Chennai wards (Wards 151 to 200)
wards_data = [
    {"number": 151, "name": "Mugalivakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 152, "name": "Manapakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 153, "name": "Nesapakkam", "zone": "Zone 11: Valasaravakkam"},
    {"number": 154, "name": "Mathuravoyal South", "zone": "Zone 11: Valasaravakkam"},
    {"number": 155, "name": "Nolambur South", "zone": "Zone 11: Valasaravakkam"},
    {"number": 156, "name": "Guindy Estate", "zone": "Zone 12: Alandur"},
    {"number": 157, "name": "Alandur North", "zone": "Zone 12: Alandur"},
    {"number": 158, "name": "Adambakkam", "zone": "Zone 12: Alandur"},
    {"number": 159, "name": "Palavanthangal", "zone": "Zone 12: Alandur"},
    {"number": 160, "name": "Nanganallur", "zone": "Zone 12: Alandur"},
    {"number": 161, "name": "Nanganallur South", "zone": "Zone 12: Alandur"},
    {"number": 162, "name": "Alandur", "zone": "Zone 12: Alandur"},
    {"number": 163, "name": "St. Thomas Mount", "zone": "Zone 12: Alandur"},
    {"number": 164, "name": "Meenambakkam", "zone": "Zone 12: Alandur"},
    {"number": 165, "name": "Pazhavanthangal South", "zone": "Zone 12: Alandur"},
    {"number": 166, "name": "Adambakkam South", "zone": "Zone 12: Alandur"},
    {"number": 167, "name": "Guindy South", "zone": "Zone 12: Alandur"},
    {"number": 168, "name": "Puzhuthivakkam", "zone": "Zone 14: Perungudi"},
    {"number": 169, "name": "Madipakkam", "zone": "Zone 14: Perungudi"},
    {"number": 170, "name": "Kotturpuram", "zone": "Zone 13: Adyar"},
    {"number": 171, "name": "Adyar West", "zone": "Zone 13: Adyar"},
    {"number": 172, "name": "Gandhi Nagar", "zone": "Zone 13: Adyar"},
    {"number": 173, "name": "Adyar East", "zone": "Zone 13: Adyar"},
    {"number": 174, "name": "Besant Nagar", "zone": "Zone 13: Adyar"},
    {"number": 175, "name": "Kalakshetra Colony", "zone": "Zone 13: Adyar"},
    {"number": 176, "name": "Thiruvanmiyur North", "zone": "Zone 13: Adyar"},
    {"number": 177, "name": "Thiruvanmiyur", "zone": "Zone 13: Adyar"},
    {"number": 178, "name": "Velachery West", "zone": "Zone 13: Adyar"},
    {"number": 179, "name": "Velachery East", "zone": "Zone 13: Adyar"},
    {"number": 180, "name": "Taramani", "zone": "Zone 13: Adyar"},
    {"number": 181, "name": "Guindy National Park", "zone": "Zone 13: Adyar"},
    {"number": 182, "name": "IIT Madras", "zone": "Zone 13: Adyar"},
    {"number": 183, "name": "Perungudi North", "zone": "Zone 14: Perungudi"},
    {"number": 184, "name": "Perungudi", "zone": "Zone 14: Perungudi"},
    {"number": 185, "name": "Palavakkam", "zone": "Zone 14: Perungudi"},
    {"number": 186, "name": "Kottivakkam", "zone": "Zone 14: Perungudi"},
    {"number": 187, "name": "Palavakkam South", "zone": "Zone 14: Perungudi"},
    {"number": 188, "name": "Neelankarai North", "zone": "Zone 14: Perungudi"},
    {"number": 189, "name": "Thuraipakkam", "zone": "Zone 14: Perungudi"},
    {"number": 190, "name": "Pallikaranai North", "zone": "Zone 14: Perungudi"},
    {"number": 191, "name": "Pallikaranai", "zone": "Zone 14: Perungudi"},
    {"number": 192, "name": "Karapakkam", "zone": "Zone 15: Sholinganallur"},
    {"number": 193, "name": "Sholinganallur East", "zone": "Zone 15: Sholinganallur"},
    {"number": 194, "name": "Uthandi", "zone": "Zone 15: Sholinganallur"},
    {"number": 195, "name": "Semmancheri West", "zone": "Zone 15: Sholinganallur"},
    {"number": 196, "name": "Injambakkam", "zone": "Zone 15: Sholinganallur"},
    {"number": 197, "name": "Karapakkam South", "zone": "Zone 15: Sholinganallur"},
    {"number": 198, "name": "Neelankarai", "zone": "Zone 15: Sholinganallur"},
    {"number": 199, "name": "Sholinganallur", "zone": "Zone 15: Sholinganallur"},
    {"number": 200, "name": "Semmancheri", "zone": "Zone 15: Sholinganallur"}
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

    # 2. Append/update wards (Wards 151 to 200)
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
