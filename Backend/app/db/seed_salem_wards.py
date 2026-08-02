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

# Official Salem wards
wards_data = [
    {"number": "01", "name": "Periya Mottur, Kaminaickenpatty, and Jagir Reddipatty."},
    {"number": "02", "name": "Jagir Ammapalayam, Mamangam, and Pookaravattam."},
    {"number": "03", "name": "Narasothipatty."},
    {"number": "04", "name": "Alagapuram Pudur and Thillai Nagar."},
    {"number": "05", "name": "Subramaniya Nagar and Reddiyur."},
    {"number": "06", "name": "Sooramangalam Main Area and Junction Road."},
    {"number": "07", "name": "Pallapatti and Three Roads Area."},
    {"number": "08", "name": "Salem Railway Junction Surrounding Blocks and Nedunchalai Nagar."},
    {"number": "09", "name": "Jagir Ammapalayam (West) and SIDCO Industrial Estate."},
    {"number": "10", "name": "Selva Nagar and Periya Mottur Kattuvalavu."},
    {"number": "11", "name": "Sivathapuram and Meyyanur (Upper Portion)."},
    {"number": "12", "name": "Bodinaickenpatti and Cross Streets."},
    {"number": "13", "name": "Kandampatty (North) and Salem-Coimbatore Highway Sides."},
    {"number": "14", "name": "Kandampatty (South)."},
    {"number": "15", "name": "Nagaramalai Foothills Area and Border Blocks."},
    {"number": "16", "name": "Fairlands and Brindavan Road."},
    {"number": "17", "name": "Saradha College Road and Central Alagapuram."},
    {"number": "18", "name": "Meyyanur Main Road and New Bus Stand Locality."},
    {"number": "19", "name": "Maravaneri and Chinnusamy Nagar."},
    {"number": "20", "name": "Old Suramangalam Boundary."},
    {"number": "21", "name": "Solam Pallem and Thillai Nagar."},
    {"number": "22", "name": "Hasthampatty Main Road and M.G.R Nagar."},
    {"number": "23", "name": "Sivathapuram Interior Layouts."},
    {"number": "24", "name": "Doctors Colony and Kumaransalai."},
    {"number": "25", "name": "Gorimedu and Sakthipuram."},
    {"number": "26", "name": "Arisipalayam (Damodaran Street) and Subbarayan Nagar."},
    {"number": "27", "name": "Arisipalayam (Vela Samy Street)."},
    {"number": "28", "name": "Shevapet (Narasimma Chetty Street & Eluthukara Street)."},
    {"number": "29", "name": "Komarasamypatty and Engineers Colony."},
    {"number": "30", "name": "Yercaud Foothills (Kullar Street / Annaigounder Vattam)."},
    {"number": "31", "name": "Srinagar and Ponnammapet Boundary."},
    {"number": "32", "name": "Ponnammapet Main Layouts."},
    {"number": "33", "name": "Narayanapattarai."},
    {"number": "34", "name": "Kalarampatty."},
    {"number": "35", "name": "Ammapet Central Bazaar."},
    {"number": "36", "name": "Pattai Kovil Area."},
    {"number": "37", "name": "Perumal Kovil Street."},
    {"number": "38", "name": "Kaliannan Street."},
    {"number": "39", "name": "Attur Main Road Blocks."},
    {"number": "40", "name": "Colony Hospital Surrounding Layouts."},
    {"number": "41", "name": "Gugai (Mettu Street)."},
    {"number": "42", "name": "Gugai (Line Road)."},
    {"number": "43", "name": "Moongapadi and Trichy Main Road (North Side)."},
    {"number": "44", "name": "Salem Fort (Kottai) Area."},
    {"number": "45", "name": "Sanjeevirayanpet Border Layout."},
    {"number": "46", "name": "Annadanapatty."},
    {"number": "47", "name": "Linemedu."},
    {"number": "48", "name": "Gugai Erumapalayam Crossway."},
    {"number": "49", "name": "Shevapet Main Market Area."},
    {"number": "50", "name": "Dadagapatty."},
    {"number": "51", "name": "Sankari Main Road (South Side) and Valluvar Nagar."},
    {"number": "52", "name": "Ambethkar Nagar and Shanmuga Nagar."},
    {"number": "53", "name": "Nagappan Main Road and Taluk Police Station Layout."},
    {"number": "54", "name": "Trichy Main Road (Western Side) and SVR Colony."},
    {"number": "55", "name": "Karungalpatty Itteri Road."},
    {"number": "56", "name": "Kondalampatty Main Area."},
    {"number": "57", "name": "Nattamangalam Boundary Layout."},
    {"number": "58", "name": "Dasanaickenpatty Border."},
    {"number": "59", "name": "P. Nattamangalam Panchayat Limits."},
    {"number": "60", "name": "Erumapalayam, K.R. Nagar, and Storekadu."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Salem" district
    district_doc = await db.districts.find_one({"name": "Salem"})
    if not district_doc:
        print("District 'Salem' not found. Creating it...")
        new_district = {
            "name": "Salem",
            "code": "SLM",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "salem@civifix.local",
            "phone": None,
            "address": "Salem District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Salem' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Salem' with ID: {district_id}")

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
                        "local_body": "Salem City Municipal Corporation",
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
                "district": "Salem",
                "local_body": "Salem City Municipal Corporation",
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
