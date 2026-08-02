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

# Official Thanjavur wards
wards_data = [
    {"number": "01", "name": "Anandhavalli Amman Kovil (North/South Streets), Anna Chathiram, Singaperumal Kovil, Vijaya Ragavachariyar Road, Pamping Station Road."},
    {"number": "02", "name": "Neelamega Perumal Kovil Street, Vennatrankarai, Palliyagraharam, Sathiya Krishna Nagar."},
    {"number": "03", "name": "Chelliyamman Kovil Street, Pappara Chinnaya Pillai Street, Karanthai Kuthiraikatti Street, Rajaram Mada Street, Arikara Street."},
    {"number": "04", "name": "Kodikaloor Adidravidar Street, Amma Thottam, Karanthai Municipal Hospital Residential Area."},
    {"number": "05", "name": "Karunthattankudi (North & Central), Samantham Narayana Street, Areas Surrounding Old Mariamman Kovil Road."},
    {"number": "06", "name": "North Rampart, Kodimarathumoolai, Attumanthai Street, Northern Historic Fort Wall Area."},
    {"number": "07", "name": "Dabir Kulam Road, South Rampart Extensions, Manambuchavadi (North)."},
    {"number": "08", "name": "Pallivanivasal Street, Keela Vastad Chavadi, Pookkara Street (North)."},
    {"number": "09", "name": "Alangudi Way, Mariamman Kovil Inner Extensions, East Rampart Limits."},
    {"number": "10", "name": "Srinivasapuram (North), Rajappa Nagar, Eastern Residential Extensions."},
    {"number": "11", "name": "West Rampart, Palli Agraharam Internal Blocks, Old Bus Stand Perimeter."},
    {"number": "12", "name": "Brihadeeswarar Temple Surroundings, Palace Complex Perimeter, Tilak Ghat."},
    {"number": "13", "name": "Konkaneshwarar Kovil Street, South Main Street Commercial Block, Town Hall Road."},
    {"number": "14", "name": "Javulikada Street, Netaji Road Retail Sector, Periya Kadai Street."},
    {"number": "15", "name": "Ayyankadai Street, Chinnakadai Street, South Rampart Business Zones."},
    {"number": "16", "name": "Manambuchavadi (Central), Graham Nagar, Nadimuthu Nagar Connecting Areas."},
    {"number": "17", "name": "Pookkara Street (South), Subramaniya Swamy Kovil Street, VOC Nagar Blocks."},
    {"number": "18", "name": "Keezha Raja Veedhi (East Main Street), Kamaraj Road Sector, Old Market Areas."},
    {"number": "19", "name": "Melaraja Veedhi (West Main Street), Vaduku Vasal, Govindarajapuram Corners."},
    {"number": "20", "name": "Vadagoor, Abraham Pandither Nagar Blocks, Trichy Road Sections."},
    {"number": "21", "name": "Medical College Road (Lower), Co-operative Colony, Arulananda Nagar (North)."},
    {"number": "22", "name": "D.P.O Lane Membalam, Corporation Power House Quarters, G.A. Canal Road."},
    {"number": "23", "name": "Railway Station Road, Gandhiji Road Retail Stretch, Junction Area Houses."},
    {"number": "24", "name": "Santhana Pillai Lane, Maratha Quarters, Old Clock Tower Area."},
    {"number": "25", "name": "Nanjikottai Road (North), Mary's Corner Blocks, Vilar Road Extensions."},
    {"number": "26", "name": "Arulananda Nagar (South), Arulananda Ammal Nagar, Parisutham Nagar."},
    {"number": "27", "name": "Medical College Road (Upper), New Housing Unit Sectors, Nataraj Nagar."},
    {"number": "28", "name": "Bank Staff Colony, LIC Colony, Ramanathan Hospital Road Area."},
    {"number": "29", "name": "Municipal Colony, New Bus Stand Western Residential Limits."},
    {"number": "30", "name": "New Bus Stand Peripheral Layout, Bus Terminal Commercial Limits."},
    {"number": "31", "name": "R.H. Road, Philomina Nagar, Serfoji College Residential Neighborhoods."},
    {"number": "32", "name": "Yagappa Nagar, Fatima Nagar Blocks, Keelavasthachavadi Extensions."},
    {"number": "33", "name": "Mission Puthu Street, Pandapies Agraharam, Mission Church Road, Mission Mettu Street, Mission Sannathi Street."},
    {"number": "34", "name": "New Mariamman Kovil Inner Layouts, Punnainallur Highway Fringes."},
    {"number": "35", "name": "Junction Vandi Pettai, Tholkappiyar Sadukkam, Pudukkottai Road Corridors."},
    {"number": "36", "name": "Nanjikottai Road Extensions, Housing Board Units Phase-1."},
    {"number": "37", "name": "Vilar Road Residential Layouts, Thillai Nagar, Kurinji Nagar."},
    {"number": "38", "name": "Tamil University Campus Area, Outer Ring Limits, Pillaiyarpatti Boundary Sectors."},
    {"number": "39", "name": "Thangam Nagar, Vennila Street Residential Stretches, Southern Limits."},
    {"number": "40", "name": "Uma Nagar, Ramani Nagar Blocks, Nanjikottai Village Connecting Areas."},
    {"number": "41", "name": "Thanjavur Medical College Campus Staff Quarters, Hospital Administrative Zones."},
    {"number": "42", "name": "Eswari Nagar, Rajarajan Nagar Blocks, West Boundary Roads."},
    {"number": "43", "name": "NK Road Residential Extensions, Sundaram Nagar Layouts."},
    {"number": "44", "name": "Vallam Road Inner Layouts, Corporation Boundary Sectors."},
    {"number": "45", "name": "Reddipalayam Road Houses, SM Housing Unit Sectors, Old Mayor Residency Area."},
    {"number": "46", "name": "Srinivasapuram (South), Cooperative Colony Rear Layouts, New Housing Unit Phase-2."},
    {"number": "47", "name": "Ramanathapuram Outer Layouts, G.A. Canal South Bank Areas."},
    {"number": "48", "name": "Pudukkottai Highway Layouts, Outer Industrial Estate Residential Blocks."},
    {"number": "49", "name": "Vilar Gramam Inner Corporation Extensions, Bypass Road Boundaries."},
    {"number": "50", "name": "Nanjikottai Integrated Corporation Village Sectors, South-East Outermost Blocks."},
    {"number": "51", "name": "Melaveli Rural-Urban Transition Zone, Western Outermost Municipal Boundary."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Thanjavur" district
    district_doc = await db.districts.find_one({"name": "Thanjavur"})
    if not district_doc:
        print("District 'Thanjavur' not found. Creating it...")
        new_district = {
            "name": "Thanjavur",
            "code": "TNJ",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "thanjavur@civifix.local",
            "phone": None,
            "address": "Thanjavur District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Thanjavur' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Thanjavur' with ID: {district_id}")

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
                        "local_body": "Thanjavur City Municipal Corporation",
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
                "district": "Thanjavur",
                "local_body": "Thanjavur City Municipal Corporation",
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
