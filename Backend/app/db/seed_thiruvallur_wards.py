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

# Detailed list of Thiruvallur wards
wards_data = [
    {"number": "01", "name": "Tollgate & Nethaji Salai area"},
    {"number": "02", "name": "Perumbakkam Colony area"},
    {"number": "03", "name": "Periya Edapalayam (Kamarajar Street area)"},
    {"number": "04", "name": "Vigneshwara Nagar area"},
    {"number": "05", "name": "ICMR Colony & Uthukottai Road areas"},
    {"number": "06", "name": "Jawahar Nagar & Vivekanandar Street area"},
    {"number": "07", "name": "Perumal Street & Sathyamoorthy Street area"},
    {"number": "08", "name": "K.V.L. Garden & Tiruttani Road northern sections"},
    {"number": "09", "name": "Thilagar Street & Nethaji Salai sections"},
    {"number": "10", "name": "JN Road central cross sections"},
    {"number": "11", "name": "Rajaji Salai & Kakkalur Road junction area"},
    {"number": "12", "name": "MGM Nagar & Veeralakshmi Street area"},
    {"number": "13", "name": "Jaya Nagar & Selai Road commercial segments"},
    {"number": "14", "name": "South Tank Road, Veera Ragavan Street, and Temple Road (Theradi)"},
    {"number": "15", "name": "East Tank Road & central bazaar limits"},
    {"number": "16", "name": "Gandhipuram & Kumaran Street zone"},
    {"number": "17", "name": "C.V. Salai (Lanes 1 to 5) & Chinnaedapalayam area"},
    {"number": "18", "name": "Thomurar Nagar & Rajendraprasad Street block"},
    {"number": "19", "name": "Sakthi Kovil Street & Swathi Nagar neighborhood"},
    {"number": "20", "name": "Kamarajapuram & Kumanan Street segments"},
    {"number": "21", "name": "Vallal Pari Street & Adiyaman Cross Street area"},
    {"number": "22", "name": "Tholkappiyan Street & Cheran 2nd Street block"},
    {"number": "23", "name": "Cholan Main Road & Maniyammai Street sector"},
    {"number": "24", "name": "Railway Quarters & L.B.S. Street neighborhood"},
    {"number": "25", "name": "Periyakuppam Station Road & Mettu Street area"},
    {"number": "26", "name": "Vallalar Street & Lalbagadhur Sasthiri Street area"},
    {
        "number": "27",
        "name": "Varatharaj Nagar, Pungathur Boundary & Pumphouse Road",
        "description": "Varatharaj Nagar (Arjunan, Cheran, Solan, Pandiyan Streets), Pungathur boundary, and Pumphouse Road"
    }
]

async def seed():
    # Load database client
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB at {mongodb_url.split('@')[-1]}...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Thiruvallur" district
    district_doc = await db.districts.find_one({"name": "Thiruvallur"})
    if not district_doc:
        print("District 'Thiruvallur' not found. Creating it...")
        new_district = {
            "name": "Thiruvallur",
            "code": "TLR",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "thiruvallur@civifix.local",
            "phone": None,
            "address": "Thiruvallur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Thiruvallur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Thiruvallur' with ID: {district_id}")

    # 2. Seed wards
    inserted_count = 0
    duplicate_count = 0
    
    for w in wards_data:
        ward_num = w["number"]
        ward_name = w["name"]
        display_name = f"{ward_num} - {ward_name}"
        desc = w.get("description", display_name)
        
        # Check if ward already exists in this district
        existing_ward = await db.wards.find_one({
            "district_id": district_id,
            "ward_number": ward_num
        })
        
        if existing_ward:
            duplicate_count += 1
            continue
            
        new_ward = {
            "district": "Thiruvallur",
            "district_id": district_id,
            "ward_name": ward_name,
            "ward_number": ward_num,
            "display_name": display_name,
            "label": display_name,
            "description": desc,
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
        
    print(f"\nSeeding summary: {inserted_count} wards inserted, {duplicate_count} duplicates skipped.")

if __name__ == "__main__":
    asyncio.run(seed())
