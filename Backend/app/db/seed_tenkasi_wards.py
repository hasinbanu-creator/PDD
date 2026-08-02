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

# Official Tenkasi wards
wards_data = [
    {"number": "01", "name": "Railway Feeder Road, Sakthi Nagar Colony, and the Northern Entry Corridors of the Municipality."},
    {"number": "02", "name": "Tamil Nadu Housing Board Colony (TNHB), Housing Board Extension Areas, and Peripheral Urban Residential Spaces."},
    {"number": "03", "name": "Mangamma Salai, Mattappa Street, and Adjoining Newly Developed Commercial-Residential Streets."},
    {"number": "04", "name": "Thaikka Street, Periya Thaikka Area, and Nearby Community Extensions."},
    {"number": "05", "name": "Kalakodi Street, Old Town Residential Quarters, and Linking Pathways to Bazaar Sectors."},
    {"number": "06", "name": "Malayan Street, Standard Urban Dense Housing Clusters, and Inner Cross Streets."},
    {"number": "07", "name": "Puliyur Street (Keezapuliyur Area), Agricultural Transitional Housing Zones."},
    {"number": "08", "name": "Utchimakali Amman Kovil 1st Street (Keezapuliyur), Surrounding Temple Streets, and Traditional Residential Blocks."},
    {"number": "09", "name": "Paraiyadi 2nd Street, Central Residential Extensions, and Local Market Connection Routes."},
    {"number": "10", "name": "Paraiyadi 1st Street, Mount Road Areas, and Adjacent Commercial Pockets."},
    {"number": "11", "name": "South Car Street, Old Market Zones, and Areas Surrounding the Historic Urban Core."},
    {"number": "12", "name": "North Car Street, Temple Chariot Path Residential Lines, and Heritage Core Housings."},
    {"number": "13", "name": "East Car Street, Local Businesses Mixed with Traditional Residential Properties."},
    {"number": "14", "name": "Amman Sannathi Street, Areas Flanking the Primary Access Routes to Local Historic Temples."},
    {"number": "15", "name": "Swamy Sannathi Street, Core Areas Surrounding the Kasi Viswanathar Temple Complex."},
    {"number": "16", "name": "Nadupettai Street, High-Density Residential Streets in the Mid-Town Region."},
    {"number": "17", "name": "Puthumanai Street, Relatively Newer Residential Extensions Within the Old City Boundaries."},
    {"number": "18", "name": "Medai Mettu Street, High-Ground Residential Localities Near Historical Landmarks."},
    {"number": "19", "name": "Mattappa Street Main, Key Connection Layouts Linking Local Commercial Zones to Residential Sectors."},
    {"number": "20", "name": "Subramaniaswamy Kovil Street, Areas Around Local Cultural Structures and Central Neighborhoods."},
    {"number": "21", "name": "Pudumanai West, Residential Expansions Along the Western Corridors of the Old City Limit."},
    {"number": "22", "name": "Shencottai Road Border Layouts, Residential Communities Situated Close to the Inter-City Connectivity Highways."},
    {"number": "23", "name": "Courtallam Road Zones, Institutional Structures, Lodging Corridors, and Tourist Transit Neighborhoods."},
    {"number": "24", "name": "Azad Nagar, Central Residential Layouts with Diverse Urban Developments."},
    {"number": "25", "name": "Quaid-e-Milleth Nagar, Peripheral Community Layouts and Mid-Scale Housing Structures."},
    {"number": "26", "name": "Keelapalayam Street, Including Keelapalayam Street 2."},
    {"number": "27", "name": "Anaikarai Street and Kulasekaranathar Kovil Street (Including Ward 27 Street 1 & 3)."},
    {"number": "28", "name": "Pungadi Vinayagar Kovil Street, Areas Around Downstream Water Bodies and Urban Layouts."},
    {"number": "29", "name": "Melapuliyur Residential Sectors, Including Parts of School Zones and Adjacent Lanes."},
    {"number": "30", "name": "Shenbaga Vinayagar Kovil Street, Encompassing Older Residential Segments and Traditional Community Pockets."},
    {"number": "31", "name": "Kasikulam Area, Layout Sectors Adjacent to Irrigation Tank Boundaries and Peripheral Farming Connections."},
    {"number": "32", "name": "Nehru Street, Central Public Administration Corridors, Local Retail Hubs, and Housing Alleys."},
    {"number": "33", "name": "Kamarajar Street, Aringar Anna Street, and Puliyur Street Segments (Comprising Ward 33 Street 2, 3, 4, and 5)."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Tenkasi" district
    district_doc = await db.districts.find_one({"name": "Tenkasi"})
    if not district_doc:
        print("District 'Tenkasi' not found. Creating it...")
        new_district = {
            "name": "Tenkasi",
            "code": "TKS",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "tenkasi@civifix.local",
            "phone": None,
            "address": "Tenkasi District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Tenkasi' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Tenkasi' with ID: {district_id}")

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
                        "local_body": "Tenkasi Municipality",
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
                "district": "Tenkasi",
                "local_body": "Tenkasi Municipality",
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
