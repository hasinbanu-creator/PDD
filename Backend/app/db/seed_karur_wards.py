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

# Official Karur wards (corrected)
wards_data = [
    {"number": "01", "name": "Arikkaranpalayam, Periya Kothur, and Chinna Kothur Areas."},
    {"number": "02", "name": "Vangapalayam and Northern Agricultural Extensions."},
    {"number": "03", "name": "Kothai Nagar Residential Blocks and Surrounding Streets."},
    {"number": "04", "name": "Gandhi Street Zones and Local Inam Karur Sectors."},
    {"number": "05", "name": "Nehru Nagar Main Sections and Nearby Layout Communities."},
    {"number": "06", "name": "Thirumanilaiyur North Commercial Corridors."},
    {"number": "07", "name": "Thirumanilaiyur South Residential Streets."},
    {"number": "08", "name": "Balambalpuram Central Neighborhood Areas."},
    {"number": "09", "name": "Balambalpuram Extension Layouts."},
    {"number": "10", "name": "L.N. Samudram Village Boundary Zones."},
    {"number": "11", "name": "Kovai Road North Side Markets and Businesses."},
    {"number": "12", "name": "Kovai Road South Residential Cross Streets."},
    {"number": "13", "name": "Gandhi Salai North Shopping and Commercial District."},
    {"number": "14", "name": "Gandhi Salai South Market Paths."},
    {"number": "15", "name": "Lakshmipuram North Traditional Residential Sector."},
    {"number": "16", "name": "Lakshmipuram South Layouts."},
    {"number": "17", "name": "Narasimmapuram Neighborhoods."},
    {"number": "18", "name": "Kottaimedu Old Town Streets, Anna Nagar, and Chinnamanaickenpatti."},
    {"number": "19", "name": "Jawahar Bazaar Core Retail Spaces."},
    {"number": "20", "name": "Bus Stand Surrounding Lodges, Terminals, and Trade Spaces."},
    {"number": "21", "name": "Railway Station Residential Perimeter Blocks."},
    {"number": "22", "name": "Government Hospital Sector and Medical Office Surroundings."},
    {"number": "23", "name": "Azad Road Residential Zone and Municipal Office Lanes."},
    {"number": "24", "name": "Bungalow Street Neighborhoods and Administrative Layouts."},
    {"number": "25", "name": "Pasupathipalayam North River Bank Streets."},
    {"number": "26", "name": "Pasupathipalayam South Residential Layout Blocks."},
    {"number": "27", "name": "Karur West Industrial Weaving Hubs."},
    {"number": "28", "name": "Agraharam Traditional Temple Streets."},
    {"number": "29", "name": "Sanapiratti Northern Rural-Urban Mix Sectors."},
    {"number": "30", "name": "Sanapiratti Core Residential Extensions."},
    {"number": "31", "name": "Andankovil East River Road Environments."},
    {"number": "32", "name": "Andankovil West Neighborhoods."},
    {"number": "33", "name": "Agraharam West and Dindigul Railway Track Layout Lines."},
    {"number": "34", "name": "Trichy Railway Track Commercial Zone Boundaries."},
    {"number": "35", "name": "D. Muthu Nagar Developments."},
    {"number": "36", "name": "Anbu Nagar Residential Zones."},
    {"number": "37", "name": "Maruthi Garden Layouts."},
    {"number": "38", "name": "Trichy Main Road Transit Hubs."},
    {"number": "39", "name": "Thanthonimalai Lower Hills and Temple Streets."},
    {"number": "40", "name": "Cauvery Nagar Residential Quarters."},
    {"number": "41", "name": "Ganga Nagar and Poonga Nagar Layouts."},
    {"number": "42", "name": "Kumaran Salai Residential Corridor."},
    {"number": "43", "name": "NGGO Nagar, Kodangippatti, and Othaiyur Street."},
    {"number": "44", "name": "Government Arts College Perimeter and Student Communities."},
    {"number": "45", "name": "Thoranakkalpatty Village Integration Areas."},
    {"number": "46", "name": "Kaliyappanur West Layouts."},
    {"number": "47", "name": "Malamanaickenpatti and Ambedkar Nagar Communities."},
    {"number": "48", "name": "Kaliyappanur East, Perumalpatti, Arugampalayam, and the District Collector's Office Campus Area."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Karur" district
    district_doc = await db.districts.find_one({"name": "Karur"})
    if not district_doc:
        print("District 'Karur' not found. Creating it...")
        new_district = {
            "name": "Karur",
            "code": "KRR",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "karur@civifix.local",
            "phone": None,
            "address": "Karur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Karur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Karur' with ID: {district_id}")

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
                        "local_body": "Karur City Municipal Corporation",
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
                "district": "Karur",
                "local_body": "Karur City Municipal Corporation",
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
