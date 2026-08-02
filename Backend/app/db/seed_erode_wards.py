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

# Official Erode wards
wards_data = [
    {"number": "01", "name": "Sengunthapuram / East Street / Chitode Areas"},
    {"number": "02", "name": "Perumal Malai / Suriyampalayam / R.N. Pudur"},
    {"number": "03", "name": "Kotthukarar Pudur / R.N. Pudur Residential Zone"},
    {"number": "04", "name": "Bhavani Main Road (R.N. Pudur Sections)"},
    {"number": "05", "name": "Mamarathupalayam Northern Boundaries"},
    {"number": "06", "name": "Suriyampalayam Town Extensions"},
    {"number": "07", "name": "B.P. Agraharam (North)"},
    {"number": "08", "name": "B.P. Agraharam (Central)"},
    {"number": "09", "name": "B.P. Agraharam (South)"},
    {"number": "10", "name": "Periya Agraharam / Bhavani Main Road Entry Points"},
    {"number": "11", "name": "Periya Agraharam (Joseph Thottam & Kasianna Street Areas)"},
    {"number": "12", "name": "Periya Agraharam (Kattur Street & Ismail Street Sections)"},
    {"number": "13", "name": "Periya Agraharam (Pandara Lane Residential Zone)"},
    {"number": "14", "name": "S.C. Agraharam Outskirts"},
    {"number": "15", "name": "S.C. Agraharam Central Areas"},
    {"number": "16", "name": "Veerappanchatram (North) / Kamaraj Nagar"},
    {"number": "17", "name": "Veerappanchatram (East) / Daneri Street"},
    {"number": "18", "name": "Veerappanchatram Central Commercial Sections"},
    {"number": "19", "name": "Manickampalayam Housing Unit Area"},
    {"number": "20", "name": "Periyasemur Municipal Extension Limit"},
    {"number": "21", "name": "Periyasemur Central Village Tract"},
    {"number": "22", "name": "Ellapalayam Rural Borders"},
    {"number": "23", "name": "Villarasampatti Residential Areas"},
    {"number": "24", "name": "Thindal (Lower Thindal & NGP Nagar)"},
    {"number": "25", "name": "Thindal (Upper Thindal Hills & Temple Surroundings)"},
    {"number": "26", "name": "Sakthi Nagar / Thindal Post Areas"},
    {"number": "27", "name": "Kalingarayanpalayam Borders"},
    {"number": "28", "name": "Edaiyankattuvalasu (Vaaranavasi Street Sections)"},
    {"number": "29", "name": "Karungalpalayam (Kandhasamy Lane Borders)"},
    {"number": "30", "name": "Karungalpalayam Central Market Tracts"},
    {"number": "31", "name": "Surampatti Valasu (M.S.K Nagar & Annaikattu Road Areas)"},
    {"number": "32", "name": "Surampatti (Parivallal Street Areas)"},
    {"number": "33", "name": "Surampatti (Kamaraj Street Residential Zones)"},
    {"number": "34", "name": "S.K.C. Road Central Residential Tracts"},
    {"number": "35", "name": "Surampatti Valasu South Extensions"},
    {"number": "36", "name": "Jaganathapuram Locality"},
    {"number": "37", "name": "Netaji Road Commercial District"},
    {"number": "38", "name": "Erode Central City (Bazaar Street Area)"},
    {"number": "39", "name": "Central Railway Station Surroundings"},
    {"number": "40", "name": "Railway Colony Housing Quarters"},
    {"number": "41", "name": "Kaikolar Thottam Areas"},
    {"number": "42", "name": "Chennimalai Road Commercial Corridors"},
    {"number": "43", "name": "Rangampalayam Limits"},
    {"number": "44", "name": "Surampatti Rural Outskirts"},
    {"number": "45", "name": "Kumalan Kuttai Residential Colony"},
    {"number": "46", "name": "Palayapalayam (North)"},
    {"number": "47", "name": "Palayapalayam (South)"},
    {"number": "48", "name": "Kasipalayam Village Area"},
    {"number": "49", "name": "Kasipalayam Housing Units"},
    {"number": "50", "name": "Shanthi Nagar Extensions"},
    {"number": "51", "name": "Moolapalayam (East)"},
    {"number": "52", "name": "Moolapalayam (West)"},
    {"number": "53", "name": "Shastri Nagar Layout"},
    {"number": "54", "name": "Transport Nagar Residential Area"},
    {"number": "55", "name": "Solar (Karur Main Road Corridor)"},
    {"number": "56", "name": "Solar Pudur Extension Tract"},
    {"number": "57", "name": "Vendipalayam Industrial Zones"},
    {"number": "58", "name": "Vendipalayam Residential Areas"},
    {"number": "59", "name": "Vendipalayam (Barrage Road Borders)"},
    {"number": "60", "name": "Vendipalayam Dump Yard / Southern Border Limits"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Erode" district
    district_doc = await db.districts.find_one({"name": "Erode"})
    if not district_doc:
        print("District 'Erode' not found. Creating it...")
        new_district = {
            "name": "Erode",
            "code": "ERD",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "erode@civifix.local",
            "phone": None,
            "address": "Erode District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Erode' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Erode' with ID: {district_id}")

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
                        "local_body": "Erode City Municipal Corporation",
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
                "district": "Erode",
                "local_body": "Erode City Municipal Corporation",
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
