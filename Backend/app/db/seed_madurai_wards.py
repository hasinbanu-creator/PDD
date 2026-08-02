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

# Official Madurai wards
wards_data = [
    {"number": "01", "name": "Santi Nagar"},
    {"number": "02", "name": "Koodal Nagar"},
    {"number": "03", "name": "Anaiyur"},
    {"number": "04", "name": "Sambandhar Alankulam"},
    {"number": "05", "name": "B.B. Kulam"},
    {"number": "06", "name": "Meenambalpuram"},
    {"number": "07", "name": "Kailaasapuram"},
    {"number": "08", "name": "Vilangudi"},
    {"number": "09", "name": "Thathaneri"},
    {"number": "10", "name": "Aarappalayam"},
    {"number": "11", "name": "Ponnaharam"},
    {"number": "12", "name": "Krishnaapalayam"},
    {"number": "13", "name": "Azhagaradi"},
    {"number": "14", "name": "Viswasapuri"},
    {"number": "15", "name": "Melapponnaharam"},
    {"number": "16", "name": "Railway Colony"},
    {"number": "17", "name": "Ellis Nagar"},
    {"number": "18", "name": "S.S. Colony"},
    {"number": "19", "name": "Ponmeni"},
    {"number": "20", "name": "Arasaradi Othakkadai"},
    {"number": "21", "name": "Bethaniyapuram"},
    {"number": "22", "name": "Kochadai"},
    {"number": "23", "name": "Visalakshi Nagar"},
    {"number": "24", "name": "Thiruppaalai"},
    {"number": "25", "name": "Kannanendhal"},
    {"number": "26", "name": "Parasuraamanpatti"},
    {"number": "27", "name": "Karpaga Nagar"},
    {"number": "28", "name": "Uthangudi"},
    {"number": "29", "name": "Masthaanpatti"},
    {"number": "30", "name": "Melamadai"},
    {"number": "31", "name": "Tahsildhar Nagar"},
    {"number": "32", "name": "Vandiyur"},
    {"number": "33", "name": "Saathamangalam"},
    {"number": "34", "name": "Arignar Anna Nagar"},
    {"number": "35", "name": "Madhichiyam"},
    {"number": "36", "name": "Aazhwarpuram"},
    {"number": "37", "name": "Sellur"},
    {"number": "38", "name": "Pandhalkudi"},
    {"number": "39", "name": "Goripalayam"},
    {"number": "40", "name": "Ahimsapuram"},
    {"number": "41", "name": "Narimedu"},
    {"number": "42", "name": "Chokkikulam"},
    {"number": "43", "name": "Tallakulam"},
    {"number": "44", "name": "K.K. Nagar"},
    {"number": "45", "name": "Pudur"},
    {"number": "46", "name": "Lourdhu Nagar"},
    {"number": "47", "name": "Reserve Line"},
    {"number": "48", "name": "Aathikulam"},
    {"number": "49", "name": "Naahanakulam"},
    {"number": "50", "name": "Swami Sannidhi"},
    {"number": "51", "name": "Meenakshi Kovil"},
    {"number": "52", "name": "Nelpettai"},
    {"number": "53", "name": "Lakshmipuram"},
    {"number": "54", "name": "Vilakkuthoon"},
    {"number": "55", "name": "Maatuthavani"},
    {"number": "56", "name": "Central Market Region"},
    {"number": "57", "name": "Kamarajar Salai"},
    {"number": "58", "name": "Pankajam Colony"},
    {"number": "59", "name": "Srinivasa Nagar"},
    {"number": "60", "name": "Sourashtra Teacher's Colony"},
    {"number": "61", "name": "Villapuram"},
    {"number": "62", "name": "Avaniapuram"},
    {"number": "63", "name": "Tiruppalai Rural Extensions"},
    {"number": "64", "name": "Sellur Extension North"},
    {"number": "65", "name": "Sathamangalam Layout"},
    {"number": "66", "name": "South Krishnan Kovil"},
    {"number": "67", "name": "Manjanakara Street"},
    {"number": "68", "name": "St. Mary's"},
    {"number": "69", "name": "Kaamarajapuram"},
    {"number": "70", "name": "Balaranganathapuram"},
    {"number": "71", "name": "Navarathinapuram"},
    {"number": "72", "name": "Thirumalai Naicker Mahal"},
    {"number": "73", "name": "Maadakkulam"},
    {"number": "74", "name": "Pazhangaanatham"},
    {"number": "75", "name": "Sundarajapuram"},
    {"number": "76", "name": "Tamilsangam Road"},
    {"number": "77", "name": "Sokkanadhar Kovil"},
    {"number": "78", "name": "Jadamuni Kovil"},
    {"number": "79", "name": "Kaajimar Street"},
    {"number": "80", "name": "Subramaniapuram"},
    {"number": "81", "name": "Solai Azhagupuram"},
    {"number": "82", "name": "Jaihindpuram Main"},
    {"number": "83", "name": "Kovalan Nagar"},
    {"number": "84", "name": "T.V.S. Nagar"},
    {"number": "85", "name": "Paamban Swami Nagar"},
    {"number": "86", "name": "Mannar College Area"},
    {"number": "87", "name": "Thirupparamkundram Town"},
    {"number": "88", "name": "Haarvipatti"},
    {"number": "89", "name": "Thirunahar"},
    {"number": "90", "name": "Balaji Nagar"},
    {"number": "91", "name": "Muthuramalingapuram"},
    {"number": "92", "name": "Palanganatham West"},
    {"number": "93", "name": "Madakkulam Extension"},
    {"number": "94", "name": "Pykara"},
    {"number": "95", "name": "Pasumalai Hills"},
    {"number": "96", "name": "Muthupatti"},
    {"number": "97", "name": "Thanakkankulam"},
    {"number": "98", "name": "Tirunagar Main"},
    {"number": "99", "name": "Austinpatti Boundary"},
    {"number": "100", "name": "Pasumalai Residential"}
]

# Wait, let's fix "01 - Santhi Nagar" vs "01 - Santi Nagar" to exactly match "Santhi Nagar" from the list:
for w in wards_data:
    if w["number"] == "01":
        w["name"] = "Santhi Nagar"

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Madurai" district
    district_doc = await db.districts.find_one({"name": "Madurai"})
    if not district_doc:
        print("District 'Madurai' not found. Creating it...")
        new_district = {
            "name": "Madurai",
            "code": "MDU",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "madurai@civifix.local",
            "phone": None,
            "address": "Madurai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Madurai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Madurai' with ID: {district_id}")

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
                        "local_body": "Madurai City Municipal Corporation",
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
                "district": "Madurai",
                "local_body": "Madurai City Municipal Corporation",
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
