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

# Official Pudukkottai wards
wards_data = [
    {"number": "01", "name": "Narimedu, Periyar Nagar, Rajiv Gandhi Nagar, Samathuvapuram, and Thaila Nagar."},
    {"number": "02", "name": "Pasumbon Nagar, Driver Colony, Venkateswara Nagar, and Subramania Nagar."},
    {"number": "03", "name": "Balan Nagar, Pudu Nagar (1st & 2nd Streets), Piragathampal Nagar, and Viswadas."},
    {"number": "04", "name": "Kovilpatti (Pudukudiyeruppu, LGGS Colony 1st to 4th Streets), New Golden Nagar, Sakthi Nagar, and Lakshmi Nagar."},
    {"number": "05", "name": "Vasanthapuri Nagar, Kovilpatti Theru, Chinnakeni Theru, Kovilpatti Otrai Theru, and Thirukokarnam Nadu Veethi."},
    {"number": "06", "name": "Mamundi Mada Veethi and Parts of the Northern Historic Market Limits."},
    {"number": "07", "name": "Adappan Vayal, Mamundi Mada Veethi, and Adjacent Residential Clusters."},
    {"number": "08", "name": "Ambalpuram (1st & 2nd Veethi)."},
    {"number": "09", "name": "North Main Street, North Main Santhu, Mela 2nd Veethi, and Ramachandirampillai Rice Mill Area."},
    {"number": "10", "name": "Mela Raja Veethi, Palaniyandi Oorani, and North 3rd Veethi."},
    {"number": "11", "name": "Ganesh Nagar 1st Street, Natham Pallam KeelaKarai, and North 3rd Veethi."},
    {"number": "12", "name": "Thanner Thotti Keelpuram, Kamarajapuram 12th, 13th, and 14th Veethi."},
    {"number": "13", "name": "Ganesh Nagar 4th Veethi, Vengopan Theru, Kamarajapuram 11th, 12th, 13th, 14th, and 15th Veethi."},
    {"number": "14", "name": "Ganesh Nagar 4th Veethi, Vengopan Theru, Adiga Unavu Urpathi Kudisaigal, and Kamarajapuram 1st to 4th Veethi."},
    {"number": "15", "name": "Historic Town-Center Housing Units and Commercial Market Zones."},
    {"number": "16", "name": "Kamarajapuram 5th to 10th Veethi, Kurukku Streets, and Ganesh Nagar 6th Veethi."},
    {"number": "17", "name": "Main Commercial Paths Adjacent to Old Town Limits."},
    {"number": "18", "name": "Central Municipality Administrative Housing Lanes."},
    {"number": "19", "name": "Post Office Quarters and Residential Extensions."},
    {"number": "20", "name": "South Main Street, Rottikara Santhu, Municipal Office Santhu, Jeil Mory Santhu, and Anumar Kovil Santhu."},
    {"number": "21", "name": "Mela 2nd Veethi (Shared Intersection Zone)."},
    {"number": "22", "name": "Santhaipettai Salai and Thondaiman Nagar."},
    {"number": "23", "name": "Marakkadai Areas and Local Warehouse Roads."},
    {"number": "24", "name": "Old Bus Stand Commercial Boundaries."},
    {"number": "25", "name": "Public Health Office Radial Neighborhoods."},
    {"number": "26", "name": "Marakkadai Salai Residential Expansions."},
    {"number": "27", "name": "South-Western Residential Layouts."},
    {"number": "28", "name": "Kamarajapuram South Extensions."},
    {"number": "29", "name": "Kamarajapuram 10th Street (Kurukku 2nd & 3rd Streets) and Ganesh Nagar 29th Street."},
    {"number": "30", "name": "Kamarajapuram 17th Street."},
    {"number": "31", "name": "Bose Nagar 4th Street."},
    {"number": "32", "name": "Gandhi Nagar Keel Mel Kurukku 4th Street and Sakthi Nagar Extension."},
    {"number": "33", "name": "Sathiyamoorthy Nagar."},
    {"number": "34", "name": "Nizam Colony and Eastern Outer Neighborhoods."},
    {"number": "35", "name": "Kalyanaramaapuram Sectors."},
    {"number": "36", "name": "Manickam Nagar and Manickam Nagar 1st & 2nd Cross Streets."},
    {"number": "37", "name": "Ashok Nagar Outer Blocks."},
    {"number": "38", "name": "Housing Board Colony Corridors."},
    {"number": "39", "name": "New Palace Road Neighborhood Extensions."},
    {"number": "40", "name": "Sakkaravarthi Nagar."},
    {"number": "41", "name": "EVR Periyar Nagar."},
    {"number": "42", "name": "Annasathiram, Sri Nagar, Kusalakudi, Divya Garden, Doctor Kalaignar Nagar, Ponnampatti, Kumaran Nagar, KLKS Nagar, and Murugan Colony."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Pudukkottai" district
    district_doc = await db.districts.find_one({"name": "Pudukkottai"})
    if not district_doc:
        print("District 'Pudukkottai' not found. Creating it...")
        new_district = {
            "name": "Pudukkottai",
            "code": "PDK",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "pudukkottai@civifix.local",
            "phone": None,
            "address": "Pudukkottai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Pudukkottai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Pudukkottai' with ID: {district_id}")

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
                        "local_body": "Pudukkottai City Municipal Corporation",
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
                "district": "Pudukkottai",
                "local_body": "Pudukkottai City Municipal Corporation",
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
