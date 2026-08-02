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

# Official Mayiladuthurai wards
wards_data = [
    {"number": "01", "name": "Adiyapillaiyar Koil Street, Kuttakulam Road, Mappadugai Road (Up to Municipal Limit), and Theepaindal Amman Kovil Mela Karai."},
    {"number": "02", "name": "Radhanallur Road, Thanthontreeswarar North Street, Alvarkulam Road, Arun Nagar, K.K.R. Nagar, and Kittappa Nagar."},
    {"number": "03", "name": "Thiruvilandur Big Street, Raja Street, Thiruvilandur East & West Madavilagam, Ambedkar Nagar, and Mettu Street."},
    {"number": "04", "name": "Amman Nagar, Annamalai Nagar, Balaji Nagar, Durka Colony, Gnanambigai Nagar, Kuppangulam East Bank, and Senthangudi Big Street."},
    {"number": "05", "name": "Durkai Amman Koil Street, North Ramalinga Street, Poompuhar Road, and Senthangudi West Street."},
    {"number": "06", "name": "K.K.R. Nagar (Thiruvilandur Side) and Peripheral Northern Entries."},
    {"number": "07", "name": "Gandhi Nagar Main Road and Adjoining Residential Layouts."},
    {"number": "08", "name": "Vathukkara Street (Koranad) and Surrounding Housing Grids."},
    {"number": "09", "name": "Abirami Nagar (Koranad) and Neighboring Extensions."},
    {"number": "10", "name": "Railady Peripheral Areas and Parts of Nehruji Street Residential Blocks."},
    {"number": "11", "name": "Otha Saragu Residential Alleys and Market Access Pathways."},
    {"number": "12", "name": "North Saliya Street and Handloom Weaver Cluster Lanes."},
    {"number": "13", "name": "Main Bazaar Road, Market Crossroads, and Commercial Storefront Lanes."},
    {"number": "14", "name": "Cutcherry Road Western Section and Government Quarter Lanes."},
    {"number": "15", "name": "Hajiyar Nagar, Mela Othasaraku, and Santhirikulam Area Lanes."},
    {"number": "16", "name": "Pandiyanthoppu Cluster and Local Village-Fringe Residential Layouts."},
    {"number": "17", "name": "Mahadana Street Northern Pockets and Immediate Connection Roads."},
    {"number": "18", "name": "Mahadana Street Main Residential Stretches and Commercial Storefront Lines."},
    {"number": "19", "name": "Dharmapuram Road Initial Stretches and Student Layout Zones."},
    {"number": "20", "name": "Outer Dharmapuram Residential Colonies Bordering the Institutional Grounds."},
    {"number": "21", "name": "T. Kotha Street Lines, Local Temple Surroundings, and Old Settlement Blocks."},
    {"number": "22", "name": "Mayuranathar Temple Perimeter Quarters, North Street, and Sannathi Street."},
    {"number": "23", "name": "Mayuranathar South Madavilagam, South Street (Pookollai Area), West Madavilagam, and West Street."},
    {"number": "24", "name": "Ayyarappar East/North/West/Sannathi Streets, Cutcherry Road East, Kalaignar Colony, Periya Kannara Street, and Tiruvarur Road (Up to Kenikkarai)."},
    {"number": "25", "name": "Viswanathapuram (1st & 3rd Cross Streets), Kankoduthapillaiyar Koil Street, Melananjilnadu, Nanjilnadu West Street (Colony), and Pattamangala North Street."},
    {"number": "26", "name": "Southern Koranad Pockets and Standard Grid Neighborhoods."},
    {"number": "27", "name": "Core Interior Lanes of Koranad, Municipal Hospital Street (Thatchar Street), Nallamuthan Street, Railway Cross Street, Sarattai Street, and Thaniyar Street."},
    {"number": "28", "name": "Cauvery Nagar, Gandhiji Salai (Mamarathu Medai to Railway Track Boundary), M.G. Road, Punukeeswarar West Street, and Vaikkalkarai Street."},
    {"number": "29", "name": "Main Sitharkadu Residential Zones and Peripheral Agricultural Fringes."},
    {"number": "30", "name": "Arockiyanathapuram, Eragali Street, Thaniyar Kudiyiruppu, and Thikunankulam Vadakarai."},
    {"number": "31", "name": "63 Var Pettai (North/South/East/West Streets), Alagappar Street, Arupathimuvarpettai, and Thukkanangulam Banks."},
    {"number": "32", "name": "Chinna Erakali East & West Streets and Surrounding Koranad Alleys."},
    {"number": "33", "name": "Kasukara Street (and Lane), Koranad Thoppu Street, Madathu Sandhu, Panchukkara Street, Semmangulam Banks, and Sundaramoorthy Pillaiyar Koil Street."},
    {"number": "34", "name": "Thaniyur Viyabarigal Street, Sangeetham Nagar, and Koranad Transition Streets."},
    {"number": "35", "name": "Avalkara Street, Pattamangala Vellan Street (and Lanes), Pattamangala New Street (and Colony), and Sathiyasai Nagar."},
    {"number": "36", "name": "Srinagar Colony, PS Nagar Srinagar Colony Extension, Puliyan Street, Besant Nagar (Malligai, Nehru, & Senbaga Streets), Tiruvarur Road, and Varathachariyar Street."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Mayiladuthurai" district
    district_doc = await db.districts.find_one({"name": "Mayiladuthurai"})
    if not district_doc:
        print("District 'Mayiladuthurai' not found. Creating it...")
        new_district = {
            "name": "Mayiladuthurai",
            "code": "MAY",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "mayiladuthurai@civifix.local",
            "phone": None,
            "address": "Mayiladuthurai District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Mayiladuthurai' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Mayiladuthurai' with ID: {district_id}")

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
                        "local_body": "Mayiladuthurai Municipality",
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
                "district": "Mayiladuthurai",
                "local_body": "Mayiladuthurai Municipality",
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
