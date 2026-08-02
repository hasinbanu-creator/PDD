import asyncio
import os
import sys
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

# Add Backend folder to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from dotenv import load_dotenv
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env")))

local_bodies_data = {
    "Udhagamandalam Municipality": [
        "Segur Road, Kakkathoppu, Thalaikundha",
        "Mettuseri, Buttfire, Finger Post",
        "Dr. Basuvaiah Nagar, Pudumund",
        "Dr. Ambedkar Nagar, HPF Colony",
        "Theetukkal, Rose Garden Area",
        "Bombay Castle North, Woodcock Road",
        "Saint Mary's Hill, Convent Road",
        "Upper Bazaar, GH Road Area",
        "Commercial Road, Main Bazaar",
        "Bombay Castle, Telecom Quarters",
        "Botanical Garden Road, Vannarpet",
        "Kodappamund, Saint Thomas Church Area",
        "Elk Hill, Lovedale Junction",
        "Bishop's Down, Woodside",
        "Old Ooty, Stone House",
        "Missionary Hill",
        "Walchamber Road",
        "Jail Hill, Shartline, Government Quarters",
        "Coonoor Road, Charing Cross",
        "Hindusthan Lever Area, Davisdale",
        "Tiger Hill, Glenmorgan Road Junction",
        "Kandal, Lower Bazaar",
        "Kandal Bazaar, Mel Thangalam, Lakshmi Street",
        "Kandal Cross, Kailasam Street",
        "Anna Nagar, West Kandal",
        "Mariamman Temple Area, Market Road",
        "Bombay Castle West, Fernhill Road",
        "Fernhill Palace Area, Nondimedu",
        "Ooty Railway Station Area, Central Bus Stand",
        "ATC Junction, Race Course Road",
        "Mani Vihar, Woodlands Area",
        "Valley View, Highlands",
        "Westlake, Boat House Road",
        "Karumariamman Kovil Street, Dhobighat",
        "Kakkanji Nagar, Anandagiri",
        "Old Manjanakorai, Godavari House Road, Pudhu Line, Jallikuzhi, Anbu Anna Colony"
    ],
    "Coonoor Municipality": [
        "Mount Road West, Bedford Upper Junction",
        "Grays Hill, Upper Coonoor",
        "Brooklands, SIMS Park Area",
        "Walker's Hill, Alwarpet",
        "Highfield Estate North, Gymkhana Road",
        "Wellington Border, Black Bridge Road",
        "Bedford Bazaar, Orange Grove",
        "Mount Pleasant North, Model House",
        "Greenville, Bleak House",
        "Spring Field, Coonoor Club Zone",
        "Singara Estate Road, Upper Droog",
        "Wellington Cantonment West Border",
        "Stanley Park, Police Quarters",
        "Hospital Road, Law's Falls View",
        "Bus Stand Area, VP Street",
        "Subramaniya Swamy Koil Street, Market Area",
        "Cash Bazaar, Kamaraj Puram",
        "Lower Coonoor Main Road, Railway Station Area",
        "Shanthi Vijay Nagar, YMCA Road",
        "Upasi Road, Glenview",
        "Mission Compound, T.T.K. Road, Wesley Mission Hill Area",
        "Krishnapuram, Mariamman Kovil Street",
        "Appleby Road, Tiger Hill, Coonoor",
        "Mount Pleasant Main Road, Sagayamadha Koil",
        "Municipal Colony, Ooty Road Entry",
        "Ottupattarai East, Vinayagar Kovil Street",
        "Woodcote Tea Estate Line",
        "Karolina Tea Estate Road, Ottupattarai West, Muthalamman Pet",
        "Gandhipuram East, Yedapalli Border",
        "Mettupalayam Road East, Mettupalayam Road South, Glendale Estate Area"
    ],
    "Kotagiri Town Panchayat": [
        "Curzon, Ketchikadu, Medanadu Estate, Osappada",
        "Kenanthurai, Uppada, Elada Bazaar, Kenthoni, Bharathi Nagar, Gundada",
        "Palmara Lease, Annanagar, Athikkambai, Marvala",
        "West Brooke, M.G.R. Nagar, Pudumanthu (Ambukal), Hadathorai, Bebben, Attaty, Bharathi Nagar",
        "Donnington, Corsley Estate, Aggal Village",
        "Johnston Square, Market Area",
        "Kotagiri Bus Stand Zone, Club Road",
        "Ramchand, Nehru Nagar",
        "Mission Compound Kotagiri, Milidhane Road",
        "Robroy Estate",
        "Koil Medu, Gandhi Maithanam Area",
        "Aravenu Lower Block",
        "Jakkatalla Village Line",
        "Kodanad Road Entry, Green View",
        "Pandiarajan Nagar, Kamaraj Nagar",
        "Sakthi Nagar, Periyar Nagar",
        "Kerben, Krishnapudur, Pudukotagiri",
        "Kattabettu Junction Line",
        "Longwood Shola Road, Yedapalli Border",
        "Karumguzy, New Hope Line",
        "Sait Line, Happy Valley"
    ],
    "Nelliyalam Municipality": [
        "Mastrikunnu, Perungarai, Kundrilkadave",
        "Nelliyalam Tan Tea Lines, Ponnani",
        "Devala Town Bazaar",
        "Devala Hatty, Attikolla",
        "Kelly Estate, Devala Lower Lines",
        "Pandalur Road, Nadghani Border",
        "Kottikunna, Nelliyalam Village",
        "Pannikolli",
        "Cherangode Border Area",
        "Kayyunni Road, Ambalamoola Border",
        "Thorapalli Entry, Gudalur Road",
        "Athikunna, Kovilpadi",
        "M.G.R. Nagar, Chethakolly Colony",
        "Mattathupadi, Hospital Padi, Natham",
        "Kariasholai Ellai",
        "Mangorange Estate, Mangorange Section 1, Hatty Road, Kallatty, Chemman Hatty",
        "Thondiyalam",
        "Chellakunna, Bhoothanakunnu",
        "Punjavayal",
        "Uppatty Hatty, Uppatty Bazaar, Uppatty, Marakar Colony",
        "Pandalur Hatty, Natham Colony"
    ],
    "Gudalur Municipality": [
        "Gudalur Bazaar, Post Office Road",
        "Ooty Road, Mysore Road Junction",
        "Puthoorvayal, Fingerpost Gudalur",
        "Kamraj Nagar, Anna Nagar",
        "Devarshola Road Entry, Gandhi Nagar",
        "Padanthorai, Sandapadi",
        "Makkalmoola, Pallipadi",
        "Sultan Battery Road, Border Outpost Line",
        "Nelakotta, Overvalley Road",
        "Gudalur GH Road, Sangam Line",
        "Mel Gudalur, Thalaikundha Way",
        "Localized Estate Division",
        "Nandatty Estate Area",
        "Kokkal Estate Area",
        "Moonnanad Estate Area",
        "Gudalur Lower Bazaar Extension",
        "Peripheral Tea Estate Settlement 1",
        "Peripheral Tea Estate Settlement 2",
        "Peripheral Tea Estate Settlement 3",
        "Peripheral Tea Estate Settlement 4",
        "Peripheral Tea Estate Settlement 5"
    ]
}

async def seed():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db_name = os.getenv("DATABASE_NAME", "civifix")
    
    print(f"Connecting to MongoDB...")
    client = AsyncIOMotorClient(mongodb_url)
    db = client[db_name]
    
    # 1. Resolve or create "The Nilgiris" district
    district_doc = await db.districts.find_one({"name": "The Nilgiris"})
    if not district_doc:
        new_district = {
            "name": "The Nilgiris",
            "code": "NIL",
            "email": "nilgiris@civifix.local",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db.districts.insert_one(new_district)
        district_id = res.inserted_id
        print(f"Created District 'The Nilgiris' with ID: {district_id}")
    else:
        district_id = district_doc["_id"]
        print(f"Found existing District 'The Nilgiris' with ID: {district_id}")
        
    # 2. Insert/update wards
    inserted_count = 0
    updated_count = 0
    
    for local_body, wards in local_bodies_data.items():
        print(f"\nProcessing {local_body} ({len(wards)} wards)...")
        for idx, ward_name in enumerate(wards, 1):
            ward_num = f"{idx:02d}"
            display_name = f"{ward_num} - {ward_name}"
            
            # Check if ward already exists
            existing_ward = await db.wards.find_one({
                "district_id": district_id,
                "local_body": local_body,
                "ward_number": ward_num
            })
            
            if existing_ward:
                await db.wards.update_one(
                    {"_id": existing_ward["_id"]},
                    {
                        "$set": {
                            "district": "The Nilgiris",
                            "ward_name": ward_name,
                            "display_name": display_name,
                            "label": display_name,
                            "description": display_name,
                            "is_active": True,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                updated_count += 1
            else:
                new_ward = {
                    "district": "The Nilgiris",
                    "local_body": local_body,
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
                inserted_count += 1
                
    print(f"\nSeeding summary: {inserted_count} wards inserted, {updated_count} wards updated.")

if __name__ == "__main__":
    asyncio.run(seed())
