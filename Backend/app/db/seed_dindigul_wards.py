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

# Official Dindigul wards
wards_data = [
    {"number": "01", "name": "Balathiruppathi, P.V. Dass Colony, Meenachinaickenpatti Road, Karunanithi Nagar, Palani Road."},
    {"number": "02", "name": "Seelapadi, Abirami Nagar, G.K. Nagar, Soundararaj Nagar, Vijay Nagar, Pallar Street, M.G.R. Nagar."},
    {"number": "03", "name": "V.M. Nagar, Udayam Colony, Gandhinagar, Saralaipatti."},
    {"number": "04", "name": "Annai Nagar, Dippo Road Areas."},
    {"number": "05", "name": "Kallipatti Blocks, Ragavendra Nagar."},
    {"number": "06", "name": "Seelapadi South Segments, Alagirigoundenur."},
    {"number": "07", "name": "MKS Nagar Road."},
    {"number": "08", "name": "R.R. Mill Road Area, Thadicombu Road."},
    {"number": "09", "name": "Chellandiammankovil Primary Blocks."},
    {"number": "10", "name": "Chellandiamman Kovil 1st and 2nd Cross Streets, Lane Street 1 to 5."},
    {"number": "11", "name": "Mounspuram 1st & 2nd Lane."},
    {"number": "12", "name": "Taluk Office Road Residential Sectors."},
    {"number": "13", "name": "Main Town Bazar and Old Taluk Area Lines."},
    {"number": "14", "name": "Rockfort Inner Ring Blocks."},
    {"number": "15", "name": "Spencer Compound, Railway Station Road Corridors."},
    {"number": "16", "name": "Bus Stand Peripheral Streets."},
    {"number": "17", "name": "East Car Street, West Car Street Zones."},
    {"number": "18", "name": "Hospital Road, East Maruthanikulam Boundaries."},
    {"number": "19", "name": "R.M. Colony 10th Cross, LIC Colony Road, Maruthanikulam North."},
    {"number": "20", "name": "Ramanathapuram, Maruthanikulam 1st & 2nd Street, R.M. Colony 80 Feet Road."},
    {"number": "21", "name": "Nehruji Nagar, Trichy Road, S.B. Colony, M.V.M. Nagar Street Road."},
    {"number": "22", "name": "M.G.R. Nagar, Sathiya Colony, St. Joseph Hospital Compound Area."},
    {"number": "23", "name": "M.V.M. Nagar Inner Blocks, Municipal Colony Road."},
    {"number": "24", "name": "Pandiyan Nagar, Mayana Salai, Palani Road Intersection Sectors."},
    {"number": "25", "name": "Pillaiyarpalayam Part, Narayana Nagar."},
    {"number": "26", "name": "Siluvathur Road Extensions."},
    {"number": "27", "name": "Marianathapuram Residential Streets."},
    {"number": "28", "name": "Govindapuram Core Areas."},
    {"number": "29", "name": "GTN College Road Limits."},
    {"number": "30", "name": "RMTC Colony Blocks."},
    {"number": "31", "name": "Siluvathur Road Southern Intersections."},
    {"number": "32", "name": "Round Road Commercial and Residential Plots."},
    {"number": "33", "name": "Mengles Road Area."},
    {"number": "34", "name": "Palani Road Old Town Block."},
    {"number": "35", "name": "Ahimshapuram, Nehruji Nagar South."},
    {"number": "36", "name": "Kamarajapuram Residential Blocks."},
    {"number": "37", "name": "Viswanathapuram Quarters."},
    {"number": "38", "name": "Savariyarpalayam North Blocks."},
    {"number": "39", "name": "Begumbur Central Mosque Layout Sectors."},
    {"number": "40", "name": "Pallapatti Local Segments."},
    {"number": "41", "name": "Saveriyar Palayam Main Road."},
    {"number": "42", "name": "Begumbur Southern Boundaries."},
    {"number": "43", "name": "Saveriyar Palayam East, Thiruvengadam Nagar."},
    {"number": "44", "name": "Enamel Factory Road, Subas Chandra Bose Street, Mettupatti."},
    {"number": "45", "name": "Mettupatti 7th Street Extensions."},
    {"number": "46", "name": "Thiruvalluvar Nagar, Barathipuram."},
    {"number": "47", "name": "Post Office Road, Barathipuram, Mettupatti Road, Samikkannukottam."},
    {"number": "48", "name": "Dippo Road, K.K. Nagar 1st Lane, Barathipuram 10th Cross Street, Nagal Nagar, Meenatchipuram Post Office Road Extension."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Dindigul" district
    district_doc = await db.districts.find_one({"name": "Dindigul"})
    if not district_doc:
        print("District 'Dindigul' not found. Creating it...")
        new_district = {
            "name": "Dindigul",
            "code": "DGL",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "dindigul@civifix.local",
            "phone": None,
            "address": "Dindigul District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Dindigul' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Dindigul' with ID: {district_id}")

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
                        "local_body": "Dindigul City Municipal Corporation",
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
                "district": "Dindigul",
                "local_body": "Dindigul City Municipal Corporation",
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
