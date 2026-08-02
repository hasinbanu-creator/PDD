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

# Official Tiruppur wards
wards_data = [
    {"number": "01", "name": "Chettipalayam, Sri Mahasakthi Nagar, and Surrounding Northern Areas."},
    {"number": "02", "name": "Nerupperichal East, Pandian Nagar East, and Jeeva Street."},
    {"number": "03", "name": "Anna Nagar West, G.M. Nagar, and Nearby Residential Limits."},
    {"number": "04", "name": "Pooluvapatti, Nerupperichal Main Village Territory."},
    {"number": "05", "name": "Vavipalayam Regional Extensions."},
    {"number": "06", "name": "Inner Layouts of Vavipalayam and Boundaries Touching Nerupperichal."},
    {"number": "07", "name": "15-Velampalayam Industrial Blocks and North-Western Extensions."},
    {"number": "08", "name": "Central Residential Streets of 15-Velampalayam."},
    {"number": "09", "name": "Samundipuram and Surrounding Commercial Printing Clusters."},
    {"number": "10", "name": "Gandhi Nagar and Adjoining Institutional Quarters."},
    {"number": "11", "name": "Kumaranandhapuram and Regional Residential Lanes."},
    {"number": "12", "name": "Murungapalayam, Balamurugan Street, and Priya Nagar School Zones."},
    {"number": "13", "name": "Vaiyapuri Nagar, Masco Nagar, and U.S.R. Thottam."},
    {"number": "14", "name": "Northern Limits of Boyampalayam and Appachi Nagar."},
    {"number": "15", "name": "Boyampalayam Central Market and Industrial Quarters."},
    {"number": "16", "name": "Poombukar Nagar, Poyampalayam Residential Pockets."},
    {"number": "17", "name": "Perichipalayam Boundary Lines and Texturing Units."},
    {"number": "18", "name": "Anupparpalayam Brassware and Vessel Manufacturing Lanes."},
    {"number": "19", "name": "Central Anupparpalayam and Tilak Nagar."},
    {"number": "20", "name": "Chikkanna College Surrounding Areas and College Road."},
    {"number": "21", "name": "Bungalow Stop, Odakkadu Residential Sectors."},
    {"number": "22", "name": "Rayapuram Commercial Limits, Northern Railway Line Grid."},
    {"number": "23", "name": "Khaderpet Garment Market and Textile Wholesale Hubs."},
    {"number": "24", "name": "Sabari Ashram, Pushpa Theatre Cross-Roads."},
    {"number": "25", "name": "Mannarai Village Expansion Blocks."},
    {"number": "26", "name": "Outer Layouts of Mannarai and Uthukuli Road Sectors."},
    {"number": "27", "name": "Pitchampalayam Pudur Commercial Zones."},
    {"number": "28", "name": "Kumaran Nagar Housing Layouts and Structural Zones."},
    {"number": "29", "name": "S.A.P. Theatre Area, Avinashi Road Commercial Corridors."},
    {"number": "30", "name": "Central Gandhipuram and Inner Town Textile Streets."},
    {"number": "31", "name": "Karuvampalayam Textile Dyeing Clusters."},
    {"number": "32", "name": "Thennampalayam Local Vegetable Market Blocks."},
    {"number": "33", "name": "Palladam Road Industrial and Processing Lanes."},
    {"number": "34", "name": "K.N.P. Colony Residential Developments."},
    {"number": "35", "name": "Kangayam Road Junctions and Nallur Limits."},
    {"number": "36", "name": "Nallur Central Administrative Boundary Lines."},
    {"number": "37", "name": "Kasipalayam Outer Commercial Layouts."},
    {"number": "38", "name": "Vijayapuram Peripheral Export Garment Sectors."},
    {"number": "39", "name": "Mudalipalayam SIDCO Outer Expansion Grid."},
    {"number": "40", "name": "Nallur Rural Interface Housing Blocks."},
    {"number": "41", "name": "Rakkiypalayam Industrial Connection Roads."},
    {"number": "42", "name": "Kovilvazhi Outer Intersections."},
    {"number": "43", "name": "Muthanampalayam Central Village Lines."},
    {"number": "44", "name": "Shanthi Nagar and Peripheral Processing Plants."},
    {"number": "45", "name": "Murugampalayam Textile Manufacturing Sectors."},
    {"number": "46", "name": "Kumarappapuram and Thiruvalluvar Street Networks."},
    {"number": "47", "name": "Rayapuram South-Facing Institutional Borders."},
    {"number": "48", "name": "Sheriff Colony and Old Municipal Office Lines."},
    {"number": "49", "name": "Town Hall Vicinity and Central Bazaars."},
    {"number": "50", "name": "Thennampalayam Southern Extents."},
    {"number": "51", "name": "Karuvampalayam Residential Streets."},
    {"number": "52", "name": "Andipalayam Agricultural and Housing Limits."},
    {"number": "53", "name": "Mangalam Road Commercial and Institutional Blocks."},
    {"number": "54", "name": "Chinnakarai Processing Industrial Grids."},
    {"number": "55", "name": "Veerapandi Residential Extensions."},
    {"number": "56", "name": "Veerapandi Central Industrial Units."},
    {"number": "57", "name": "Peripheral Layouts of Murugampalayam."},
    {"number": "58", "name": "Sevanthampalayam and KRS Garden."},
    {"number": "59", "name": "Kovilvazhi Post, Muthanampalayam Rural Boundary."},
    {"number": "60", "name": "Veppangadu, Krishna Nagar, and Dharapuram Road Layouts."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Tiruppur" district
    district_doc = await db.districts.find_one({"name": "Tiruppur"})
    if not district_doc:
        print("District 'Tiruppur' not found. Creating it...")
        new_district = {
            "name": "Tiruppur",
            "code": "TPR",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "tiruppur@civifix.local",
            "phone": None,
            "address": "Tiruppur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Tiruppur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Tiruppur' with ID: {district_id}")

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
                        "local_body": "Tiruppur City Municipal Corporation",
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
                "district": "Tiruppur",
                "local_body": "Tiruppur City Municipal Corporation",
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
