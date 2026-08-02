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

# Official Tiruchirappalli wards
wards_data = [
    {"number": "01", "name": "Keela Uthara Street, Chithra Street, Srirangam Temple Premises."},
    {"number": "02", "name": "Mela Viboothi Praharam, Alagiripuram, Vasu Devan Street."},
    {"number": "03", "name": "Gandhi Road, Chennai Trunk Road Area, Teppakulam."},
    {"number": "04", "name": "Srirangam North (Coleroon Bank), Satara Street."},
    {"number": "05", "name": "Srinivasachariyar Street, Gandhi Road, Thatham Street."},
    {"number": "06", "name": "Srirangam South / Thiruvanaikoil Boundaries."},
    {"number": "07", "name": "Pitchandar Kovil, Utthamar Kovil Station Limits."},
    {"number": "08", "name": "Woraiyur North, Salai Road."},
    {"number": "09", "name": "Nachiyar Kovil, Woraiyur Central."},
    {"number": "10", "name": "Puthur High Road, Bishop Heber Area."},
    {"number": "11", "name": "Tennur, Annanagar West."},
    {"number": "12", "name": "Gandhi Market Northern Fringe, Oyamari Road Areas."},
    {"number": "13", "name": "Sanjeevi Nagar, Devathanam."},
    {"number": "14", "name": "Singarathope, Super Bazaar Commercial Pockets."},
    {"number": "15", "name": "Rockfort Area, Main Guard Gate, Chinna Bazaar."},
    {"number": "16", "name": "Varaganeri North, Periya Milaguparai."},
    {"number": "17", "name": "Ariyamangalam Ukkadai, Kamaraj Nagar."},
    {"number": "18", "name": "Malaiyappa Nagar, Rail Nagar."},
    {"number": "19", "name": "Tharanallur West, Viswas Nagar."},
    {"number": "20", "name": "Uyyakondan River Banks, Tharanallur East."},
    {"number": "21", "name": "Virupachipuram, Madurai Road Fringe."},
    {"number": "22", "name": "Thillai Nagar North, Cross Streets."},
    {"number": "23", "name": "Palakkarai Road, Old Mailam Santhai, Jail Road."},
    {"number": "24", "name": "Thillai Nagar South, Shastri Road Limits."},
    {"number": "25", "name": "Cantonment East, Collector Office Area."},
    {"number": "26", "name": "Cantonment West, Central Bus Stand Layout."},
    {"number": "27", "name": "Pirattiyur North, Karumandapam West."},
    {"number": "28", "name": "Karumandapam East, Royal Nagar."},
    {"number": "29", "name": "Ramachandra Nagar, Pirattiyur South."},
    {"number": "30", "name": "Ariyamangalam Industrial Area, Kamarajapuram."},
    {"number": "31", "name": "Nehruji Nagar, Ambikapuram."},
    {"number": "32", "name": "Kattur, Pappakurichi Village Areas."},
    {"number": "33", "name": "Kattur Central, Kailash Nagar."},
    {"number": "34", "name": "Ellaikkudi, Vengur Boundaries."},
    {"number": "35", "name": "Tiruverumbur North, BHEL Township Outskirts."},
    {"number": "36", "name": "Navalpattu Road, Anna Nagar East."},
    {"number": "37", "name": "Thuvakudi Border, Asath Street."},
    {"number": "38", "name": "Prakash Nagar, BHEL Colony Lanes."},
    {"number": "39", "name": "Koothappar Road Limits."},
    {"number": "40", "name": "Vignesh Nagar, Tiruverumbur Town."},
    {"number": "41", "name": "Krishnasamudram Area."},
    {"number": "42", "name": "Pappakurichi South."},
    {"number": "43", "name": "Keezhalkandarkottai East."},
    {"number": "44", "name": "Mookambigai Nagar, School Street Area."},
    {"number": "45", "name": "Natarajapuram, Tiruverumbur Central."},
    {"number": "46", "name": "Pathala Ponniamman Kovil Street Limits."},
    {"number": "47", "name": "Sangiliyandapuram Central."},
    {"number": "48", "name": "Annanagar, MGR Nagar Residential Areas."},
    {"number": "49", "name": "Melakalkandar Kottai West."},
    {"number": "50", "name": "Alathur, Venkatesa Nagar."},
    {"number": "51", "name": "Golden Rock North, Railway Colony Pockets."},
    {"number": "52", "name": "Ponmalai Patti, Central Colony."},
    {"number": "53", "name": "Williams Road, Beema Nagar, Raja Colony."},
    {"number": "54", "name": "Senthanneerpuram, Sangiliyandapuram East."},
    {"number": "55", "name": "Edamalaipatti Pudur (E-Pudur) Main Area."},
    {"number": "56", "name": "Subramaniyapuram East, Military Colony."},
    {"number": "57", "name": "Khajamalai Central, Anna Stadium Limits."},
    {"number": "58", "name": "Simco Colony, Arunachala Nagar, Anbu Nagar."},
    {"number": "59", "name": "Ariyamangalam South, Ganesan Nagar."},
    {"number": "60", "name": "Melapandamangalam, Linga Nagar, Fathima Nagar."},
    {"number": "61", "name": "K. Sathanur North, Airport Road."},
    {"number": "62", "name": "JK Nagar, Khajamalai West."},
    {"number": "63", "name": "Kottapattu, Housing Board Colony."},
    {"number": "64", "name": "K. Sathanur South, Gundur Borders."},
    {"number": "65", "name": "Bell Nagar, Ranimeiyammai Nagar, Wireless Road, Kulappatti."}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Tiruchirappalli" district
    district_doc = await db.districts.find_one({"name": "Tiruchirappalli"})
    if not district_doc:
        print("District 'Tiruchirappalli' not found. Creating it...")
        new_district = {
            "name": "Tiruchirappalli",
            "code": "TRY",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "tiruchirappalli@civifix.local",
            "phone": None,
            "address": "Tiruchirappalli District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Tiruchirappalli' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Tiruchirappalli' with ID: {district_id}")

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
                        "local_body": "Tiruchirappalli City Municipal Corporation",
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
                "district": "Tiruchirappalli",
                "local_body": "Tiruchirappalli City Municipal Corporation",
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
