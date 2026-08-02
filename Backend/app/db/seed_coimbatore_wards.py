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

# Official Coimbatore wards (skipping 31)
wards_data = [
    {"number": "01", "name": "Thudiyalur (North), Appanaickenpalayam"},
    {"number": "02", "name": "Thudiyalur (South), Viswanathapuram"},
    {"number": "03", "name": "Vellakinar Village, Subanaickenpalayam"},
    {"number": "04", "name": "Goundampalayam (North), Cheran Nagar"},
    {"number": "05", "name": "Kalapatti (East), Kurumbapalayam"},
    {"number": "06", "name": "Kalapatti (West), Karupparayanpalayam"},
    {"number": "07", "name": "Chinniyampalayam, RG Pudur"},
    {"number": "08", "name": "SITRA Area, Airport Boundary, Chitra Road"},
    {"number": "09", "name": "Vinayagapuram, Saravanampatti Border"},
    {"number": "10", "name": "Saravanampatti (North), Shajahan Nagar"},
    {"number": "11", "name": "Saravanampatti (South), Vellanaipatti"},
    {"number": "12", "name": "Chinnavedampatti, Jothi Nagar"},
    {"number": "13", "name": "Vilankurichi (North), Mayilampatti"},
    {"number": "14", "name": "Vilankurichi (South), Maheshwari Nagar"},
    {"number": "15", "name": "Kalapatti (North), Cheran Maa Nagar"},
    {"number": "16", "name": "Vadavalli (North), Maruthamalai Foothills"},
    {"number": "17", "name": "Vadavalli (South), Mullai Nagar"},
    {"number": "18", "name": "Goundampalayam (South), TVS Nagar"},
    {"number": "19", "name": "Kavundampalayam, Idigarai Road Area"},
    {"number": "20", "name": "Sanganoor (North), Nallampalayam"},
    {"number": "21", "name": "Sanganoor (South), Kannappa Nagar"},
    {"number": "22", "name": "Peelamedu (East), HUDCO Colony"},
    {"number": "23", "name": "TNHB Colony, Anjugam Nagar"},
    {"number": "24", "name": "Chitra, Civil Aerodrome Road"},
    {"number": "25", "name": "Maniyakarampalayam, Ganapathy (North)"},
    {"number": "26", "name": "Ganapathy (East), Textool Area"},
    {"number": "27", "name": "Ganapathy (West), Gandhinagar"},
    {"number": "28", "name": "Avarampalayam, Illango Nagar"},
    {"number": "29", "name": "Peelamedu (North), VK Road Area"},
    {"number": "30", "name": "Peelamedu (West), Pudur"},
    {"number": "32", "name": "Vilankurichi East, Maheshwari Nagar Extension"},
    {"number": "33", "name": "Sowripalayam (North), Meena Estate"},
    {"number": "34", "name": "Sowripalayam (East), Krishna Colony"},
    {"number": "35", "name": "Singanallur (North), Masakalipalayam"},
    {"number": "36", "name": "Singanallur (East), Ondipudur (North)"},
    {"number": "37", "name": "Ondipudur (South), SIHS Colony"},
    {"number": "38", "name": "Veerakeralam (North), Telungupalayam"},
    {"number": "39", "name": "Veerakeralam (South), Linganoor"},
    {"number": "40", "name": "Telungupalayam (West), Selvapuram North"},
    {"number": "41", "name": "Velandipalayam, Saibaba Colony (West)"},
    {"number": "42", "name": "Saibaba Colony (East), NSS Road"},
    {"number": "43", "name": "RS Puram (North), Rathinapuri Border"},
    {"number": "44", "name": "Tatabad, Sivananda Colony"},
    {"number": "45", "name": "Gandhipuram, Cross Cut Road"},
    {"number": "46", "name": "KK Pudur, Saibaba Colony Central"},
    {"number": "47", "name": "Sukrawarpet, Ponnurangam Road"},
    {"number": "48", "name": "Ram Nagar, Kattoor"},
    {"number": "49", "name": "Anupparpalayam, Central Jail Area"},
    {"number": "50", "name": "Singanallur (West), Kamarajar Road"},
    {"number": "51", "name": "Ramanathapuram (North), Trichy Road Area"},
    {"number": "52", "name": "Kallimadai, Varadharajapuram"},
    {"number": "53", "name": "Trichy Road South, Singanallur Tank Area"},
    {"number": "54", "name": "Neelikonampalayam, Nethajipuram"},
    {"number": "55", "name": "Kurichi (North), Podanur Road"},
    {"number": "56", "name": "Ondipudur East, Weavers Colony"},
    {"number": "57", "name": "Sidhapudur, Balasundaram Road"},
    {"number": "58", "name": "Papanaickenpalayam (North), Lakshmi Mills Area"},
    {"number": "59", "name": "Papanaickenpalayam (South), Ammankulam"},
    {"number": "60", "name": "Kurichi (East), Industrial Estate"},
    {"number": "61", "name": "Eichanari, Madukkarai Road"},
    {"number": "62", "name": "Ramanathapuram (Central), Puliakulam"},
    {"number": "63", "name": "Puliakulam (South), Sowripalayam Pirivu"},
    {"number": "64", "name": "Red Fields, Race Course (North)"},
    {"number": "65", "name": "Race Course (South), Air Force Area"},
    {"number": "66", "name": "Town Hall, Oppanakara Street"},
    {"number": "67", "name": "Ukkadam (North), Periyakulam Boundary"},
    {"number": "68", "name": "Kempatty Colony, Variety Hall Road"},
    {"number": "69", "name": "Fort Area, Nawab Hakim Road"},
    {"number": "70", "name": "Bazaar Street, Thomas Street"},
    {"number": "71", "name": "RS Puram (South), DB Road"},
    {"number": "72", "name": "Selvapuram (East), Kumarasamy Lake Area"},
    {"number": "73", "name": "Selvapuram (West), Shanthi Nagar"},
    {"number": "74", "name": "Ponnaiyarajapuram, Chinthamani"},
    {"number": "75", "name": "Seeranaickenpalayam, Siruvani Main Road"},
    {"number": "76", "name": "Telungupalayam South, Gandhi Park"},
    {"number": "77", "name": "Selvapuram South, Housing Unit Area"},
    {"number": "78", "name": "Kumarasamy Nagar, Perur Road Boundary"},
    {"number": "79", "name": "Veerakeralam East, Wild Life Boundary"},
    {"number": "80", "name": "Ukkadam (South), Bilal Nagar"},
    {"number": "81", "name": "Karumbukadai, Azad Nagar"},
    {"number": "82", "name": "Sungam, Trichy Road Central"},
    {"number": "83", "name": "Ramanathapuram (South), Olympus"},
    {"number": "84", "name": "Nanjundapuram, Parsn Apartments Area"},
    {"number": "85", "name": "Kuniyamuthur (North), Kovaipudur Pirivu"},
    {"number": "86", "name": "Kuniyamuthur (South), Idaiyarpalayam"},
    {"number": "87", "name": "Kovaipudur, NH 47 Bypass"},
    {"number": "88", "name": "Sugunapuram, BK Pudur"},
    {"number": "89", "name": "Kuniyamuthur East, Sri Krishna College Area"},
    {"number": "90", "name": "Kurichi (West), Phase I Housing Unit"},
    {"number": "91", "name": "Sundarapuram (West), Machampalayam"},
    {"number": "92", "name": "Sundarapuram (East), LIC Colony"},
    {"number": "93", "name": "Kurichi Pirivu, Kamaraj Nagar"},
    {"number": "94", "name": "Podanur (West), Anna Nagar"},
    {"number": "95", "name": "Podanur (Central), Railway Colony"},
    {"number": "96", "name": "Kurichi South, Sundarapuram"},
    {"number": "97", "name": "Kurichi Southwest, Eachanari"},
    {"number": "98", "name": "Podanur (South), Gurusamy Pillai Street"},
    {"number": "99", "name": "Podanur East, Sathar Sagip Street"},
    {"number": "100", "name": "Chettipalayam Road Boundary, Ganesapuram"}
]

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "Coimbatore" district
    district_doc = await db.districts.find_one({"name": "Coimbatore"})
    if not district_doc:
        print("District 'Coimbatore' not found. Creating it...")
        new_district = {
            "name": "Coimbatore",
            "code": "CBE",
            "state": "Tamil Nadu",
            "admin_id": None,
            "email": "coimbatore@civifix.local",
            "phone": None,
            "address": "Coimbatore District Headquarters",
            "is_active": True,
            "created_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'Coimbatore' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'Coimbatore' with ID: {district_id}")

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
                        "local_body": "Coimbatore City Municipal Corporation",
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
                "district": "Coimbatore",
                "local_body": "Coimbatore City Municipal Corporation",
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
