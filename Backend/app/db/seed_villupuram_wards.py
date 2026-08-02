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

# Official Villupuram wards
wards_data = [
    {"number": "01", "name": "A.P.S Nagar and Virattikuppam Road sectors."},
    {"number": "02", "name": "Kamala Nagar and Kaivallaiya Street areas."},
    {"number": "03", "name": "Ragavendra Nagar and Chitherikarai localities."},
    {"number": "04", "name": "Kakuppam and Poyyapakkam Post boundary sectors."},
    {"number": "05", "name": "Seethalaisathanar Veethi and M. Kuchipalayam."},
    {"number": "06", "name": "North Kuchipalayam extensions and adjacent agricultural green boundaries."},
    {"number": "07", "name": "Balakrishnan Street and central commercial lanes."},
    {"number": "08", "name": "Narasingapuram Main Street blocks."},
    {"number": "09", "name": "Ranganathan Road residential layout lines."},
    {"number": "10", "name": "Valudhareddy Eri fringe areas."},
    {"number": "11", "name": "Jawaharlal Nehru Road and old market boundaries."},
    {"number": "12", "name": "Mahathma Gandhi Road commercial centers."},
    {"number": "13", "name": "Kamaraj Street residential sectors."},
    {"number": "14", "name": "Old Bus Stand infrastructure zones and surrounding shops."},
    {"number": "15", "name": "Kalaignar Karunanidhi Street corridors."},
    {"number": "16", "name": "Chennai Trunk Road transit segments."},
    {"number": "17", "name": "Agaram Pattai neighborhood grids."},
    {"number": "18", "name": "Thiru.Vi.Ka. Road public squares."},
    {"number": "19", "name": "Napalaya Street and Thiyagaraja Street blocks."},
    {"number": "20", "name": "Kizhagraharam Street, Appar Street, and East Pondy Road grids."},
    {"number": "21", "name": "M.R.K. Street and V. Maruthur localities."},
    {"number": "22", "name": "Kandasamy Layout First Street sectors."},
    {"number": "23", "name": "Mel Vanniyar Street and Poonthottam residential areas."},
    {"number": "24", "name": "Trichy Main Road and Sundarajan Nagar blocks."},
    {"number": "25", "name": "Thendral Street and Vandimedu layouts."},
    {"number": "26", "name": "Ramamoorthy Nagar and Vandimedu extensions."},
    {"number": "27", "name": "Kandasamy Layout near K.K. Road."},
    {"number": "28", "name": "Mel Vanniyar Street east flank and V. Maruthur."},
    {"number": "29", "name": "Thiruvalluvar Street core zones."},
    {"number": "30", "name": "Vasantha Nagar and East Pondy Road links."},
    {"number": "31", "name": "Court Road institutional sectors and VOC Street lanes."},
    {"number": "32", "name": "Government Arts College perimeter and College Road residential blocks."},
    {"number": "33", "name": "Naickan Thoppu and Nandanar Street limits."},
    {"number": "34", "name": "Vazhudhareddy inner settlement, Kubera Street, and Maha Vishnu Street."},
    {"number": "35", "name": "Iyyanar Kulam South and Court Road junctions."},
    {"number": "36", "name": "North Railway Colony housing blocks."},
    {"number": "37", "name": "Villupuram Junction railway housing lines."},
    {"number": "38", "name": "Power House Road industrial and residential mix."},
    {"number": "39", "name": "Salamedu peripheral residential colonies."},
    {"number": "40", "name": "Periyar Nagar and Manickam Layout sectors."},
    {"number": "41", "name": "Housing Board Colony blocks and Vasantham Nagar lines."},
    {"number": "42", "name": "New Bus Stand Road North boundaries."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Villupuram" district
    district_doc = await db.districts.find_one({"name": "Villupuram"})
    if not district_doc:
        print("District 'Villupuram' not found. Creating it...")
        new_district = {
            "name": "Villupuram",
            "code": "VPM",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "villupuram@civifix.local",
            "phone": None,
            "address": "Villupuram District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Villupuram' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Villupuram' with ID: {district_id}")

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
                        "local_body": "Villupuram Municipality",
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
                "district": "Villupuram",
                "local_body": "Villupuram Municipality",
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
