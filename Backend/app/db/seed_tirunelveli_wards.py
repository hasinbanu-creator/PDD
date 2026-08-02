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

# Official Tirunelveli wards
wards_data = [
    {"number": "01", "name": "Sankarnagar / Madurai Road (Thachanallur Zone)"},
    {"number": "02", "name": "Karaieruppu / Sundarapuram (Thachanallur Zone)"},
    {"number": "03", "name": "Thachanallur North / Senthimangalam (Thachanallur Zone)"},
    {"number": "04", "name": "Thachanallur Main Town (Thachanallur Zone)"},
    {"number": "05", "name": "Kallidaikurichi Border / Palayamkottai West (Palayamkottai Zone)"},
    {"number": "06", "name": "Kokkirakulam / District Collectorate Area (Palayamkottai Zone)"},
    {"number": "07", "name": "Palayamkottai Central / High Ground (Palayamkottai Zone)"},
    {"number": "08", "name": "V.M. Chatram / Maharaja Nagar (Palayamkottai Zone)"},
    {"number": "09", "name": "Kariaiyiruppu / KTC Nagar (Palayamkottai Zone)"},
    {"number": "10", "name": "Thimmarajapuram East (Thachanallur Zone)"},
    {"number": "11", "name": "Alaganeri / Pirayankulam (Thachanallur Zone)"},
    {"number": "12", "name": "Vellakoil / Tharapuram Road (Thachanallur Zone)"},
    {"number": "13", "name": "Chatram Pudukulam (Thachanallur Zone)"},
    {"number": "14", "name": "Manimoortheeswaram (Thachanallur Zone)"},
    {"number": "15", "name": "Kandiaperi / Tirunelveli Junction North (Tirunelveli Zone)"},
    {"number": "16", "name": "Tirunelveli Junction Main / Bus Stand Area (Tirunelveli Zone)"},
    {"number": "17", "name": "Meenakshipuram (Tirunelveli Zone)"},
    {"number": "18", "name": "Kailasapuram (Tirunelveli Zone)"},
    {"number": "19", "name": "Tirunelveli Town East / Nellaiappar Temple North (Tirunelveli Zone)"},
    {"number": "20", "name": "Nellaiappar Temple West Car Street (Tirunelveli Zone)"},
    {"number": "21", "name": "Kallathikulam / Town South (Tirunelveli Zone)"},
    {"number": "22", "name": "Kurichi (Tirunelveli Zone)"},
    {"number": "23", "name": "Narasinganallur West (Tirunelveli Zone)"},
    {"number": "24", "name": "Narasinganallur East / Pettai (Tirunelveli Zone)"},
    {"number": "25", "name": "Pettai Main Bazaar / Cheranmahadevi Road (Tirunelveli Zone)"},
    {"number": "26", "name": "Kondana Nagaram (Tirunelveli Zone)"},
    {"number": "27", "name": "Karuppandurai (Tirunelveli Zone)"},
    {"number": "28", "name": "Thiruvannathapuram (Thachanallur Zone)"},
    {"number": "29", "name": "Udayarpatti (Thachanallur Zone)"},
    {"number": "30", "name": "Sindupoondurai (Thachanallur Zone)"},
    {"number": "31", "name": "Melapalayam North / Tamiraparani Riverbank (Melapalayam Zone)"},
    {"number": "32", "name": "Palayamkottai South Bazaar (Palayamkottai Zone)"},
    {"number": "33", "name": "Vanarpettai (Palayamkottai Zone)"},
    {"number": "34", "name": "Murugankurichi (Palayamkottai Zone)"},
    {"number": "35", "name": "Palayamkottai Bus Stand Area / Holy Cross (Palayamkottai Zone)"},
    {"number": "36", "name": "St. Xavier's College Area / Perumalpuram North (Palayamkottai Zone)"},
    {"number": "37", "name": "Perumalpuram South (Palayamkottai Zone)"},
    {"number": "38", "name": "NGO Colony (Palayamkottai Zone)"},
    {"number": "39", "name": "Reddiarpatti Border (Palayamkottai Zone)"},
    {"number": "40", "name": "Melapalayam Market Area (Melapalayam Zone)"},
    {"number": "41", "name": "Melapalayam Bazaar (Melapalayam Zone)"},
    {"number": "42", "name": "Nethaji Nagar (Melapalayam Zone)"},
    {"number": "43", "name": "Alif Nagar (Melapalayam Zone)"},
    {"number": "44", "name": "Melapalayam Central (Melapalayam Zone)"},
    {"number": "45", "name": "Karim Nagar (Melapalayam Zone)"},
    {"number": "46", "name": "Melanatham (Melapalayam Zone)"},
    {"number": "47", "name": "Kurichi Kulam Road (Melapalayam Zone)"},
    {"number": "48", "name": "Hameediah Nagar (Melapalayam Zone)"},
    {"number": "49", "name": "Rahmath Nagar East (Melapalayam Zone)"},
    {"number": "50", "name": "Rahmath Nagar West / Sadakathullah Appa College (Melapalayam Zone)"},
    {"number": "51", "name": "Tharuvai Rural Sector (Melapalayam Zone)"},
    {"number": "52", "name": "Rajagopalapuram (Melapalayam Zone)"},
    {"number": "53", "name": "Nochikulam (Melapalayam Zone)"},
    {"number": "54", "name": "Melapalayam South Border (Melapalayam Zone)"},
    {"number": "55", "name": "Shanthi Nagar / Kanyakumari Highway Access (Palayamkottai Zone)"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Tirunelveli" district
    district_doc = await db.districts.find_one({"name": "Tirunelveli"})
    if not district_doc:
        print("District 'Tirunelveli' not found. Creating it...")
        new_district = {
            "name": "Tirunelveli",
            "code": "TNV",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "tirunelveli@civifix.local",
            "phone": None,
            "address": "Tirunelveli District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Tirunelveli' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Tirunelveli' with ID: {district_id}")

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
                        "local_body": "Tirunelveli City Municipal Corporation",
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
                "district": "Tirunelveli",
                "local_body": "Tirunelveli City Municipal Corporation",
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
