import asyncio
import re
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import UpdateOne

async def main():
    client = AsyncIOMotorClient("mongodb://admin:shatkhi123@34.14.168.135:27017/?authSource=admin")
    db = client.civifix

    # 1. Drop existing constituencies collection
    await db.constituencies.drop()
    print("Dropped old constituencies collection.")

    # 2. Create index on constituencies
    await db.constituencies.create_index([("district_id", 1), ("name", 1)], unique=True)
    print("Created unique index (district_id, name) on constituencies.")

    # 3. Find all districts
    districts = await db.districts.find().to_list(length=100)
    print(f"Found {len(districts)} districts.")

    # Find Chennai district doc
    chennai_doc = None
    for d in districts:
        if d["name"].strip().lower() == "chennai":
            chennai_doc = d
            break
    
    if not chennai_doc:
        print("Chennai district not found. Cannot proceed.")
        return

    chennai_id = chennai_doc["_id"]

    # Fetch all wards
    print("Fetching all wards into memory...")
    wards = await db.wards.find().to_list(length=50000)
    print(f"Loaded {len(wards)} wards.")

    # Generate constituencies to create
    constituencies_to_create = {} # (district_id_str, name) -> new_id
    
    # Pre-generate IDs for all constituencies
    for ward in wards:
        dist_id = ward["district_id"]
        dist_name = "Unknown"
        for d in districts:
            if d["_id"] == dist_id:
                dist_name = d["name"]
                break

        constituency_name = None

        if str(dist_id) == str(chennai_id):
            zone = ward.get("zone", "")
            zone_num_match = re.search(r'(\d+)', zone)
            zone_num = int(zone_num_match.group(1)) if zone_num_match else 0
            
            if zone_num == 1:
                constituency_name = "Thiruvottiyur"
            elif zone_num == 2:
                constituency_name = "Manali"
            elif zone_num == 3:
                constituency_name = "Madhavaram"
            elif zone_num == 4:
                constituency_name = "Tondiarpet"
            elif zone_num == 5:
                constituency_name = "Royapuram"
            elif zone_num == 6:
                constituency_name = "Thiru-Vi-Ka Nagar"
            elif zone_num == 7:
                constituency_name = "Ambattur"
            elif zone_num == 8:
                constituency_name = "Anna Nagar"
            elif zone_num == 9:
                constituency_name = "Teynampet"
            elif zone_num == 10:
                constituency_name = "Kodambakkam"
            elif zone_num == 11:
                constituency_name = "Valasaravakkam"
            elif zone_num == 12:
                constituency_name = "Alandur"
            elif zone_num == 13:
                constituency_name = "Velachery"
            elif zone_num == 14:
                constituency_name = "Perungudi"
            elif zone_num == 15:
                constituency_name = "Sholinganallur"
            else:
                constituency_name = "Velachery"
        else:
            local_body = ward.get("local_body", "Municipal Area")
            ward_num_str = str(ward.get("ward_number", "1"))
            try:
                digits = re.findall(r'\d+', ward_num_str)
                ward_num = int(digits[0]) if digits else 1
            except Exception:
                ward_num = 1

            if ward_num <= 15:
                constituency_name = f"{local_body} Constituency 1"
            else:
                constituency_name = f"{local_body} Constituency 2"

        key = (str(dist_id), constituency_name)
        if key not in constituencies_to_create:
            constituencies_to_create[key] = {
                "_id": ObjectId(),
                "name": constituency_name,
                "district_id": dist_id,
                "district_name": dist_name,
                "is_active": True
            }

    # Bulk insert all constituencies
    const_list = list(constituencies_to_create.values())
    if const_list:
        await db.constituencies.insert_many(const_list)
        print(f"Bulk inserted {len(const_list)} constituencies.")

    # Build bulk write operations for wards
    bulk_updates = []
    for ward in wards:
        dist_id = ward["district_id"]
        
        if str(dist_id) == str(chennai_id):
            zone = ward.get("zone", "")
            zone_num_match = re.search(r'(\d+)', zone)
            zone_num = int(zone_num_match.group(1)) if zone_num_match else 0
            
            if zone_num == 1:
                constituency_name = "Thiruvottiyur"
            elif zone_num == 2:
                constituency_name = "Manali"
            elif zone_num == 3:
                constituency_name = "Madhavaram"
            elif zone_num == 4:
                constituency_name = "Tondiarpet"
            elif zone_num == 5:
                constituency_name = "Royapuram"
            elif zone_num == 6:
                constituency_name = "Thiru-Vi-Ka Nagar"
            elif zone_num == 7:
                constituency_name = "Ambattur"
            elif zone_num == 8:
                constituency_name = "Anna Nagar"
            elif zone_num == 9:
                constituency_name = "Teynampet"
            elif zone_num == 10:
                constituency_name = "Kodambakkam"
            elif zone_num == 11:
                constituency_name = "Valasaravakkam"
            elif zone_num == 12:
                constituency_name = "Alandur"
            elif zone_num == 13:
                constituency_name = "Velachery"
            elif zone_num == 14:
                constituency_name = "Perungudi"
            elif zone_num == 15:
                constituency_name = "Sholinganallur"
            else:
                constituency_name = "Velachery"
        else:
            local_body = ward.get("local_body", "Municipal Area")
            ward_num_str = str(ward.get("ward_number", "1"))
            try:
                digits = re.findall(r'\d+', ward_num_str)
                ward_num = int(digits[0]) if digits else 1
            except Exception:
                ward_num = 1

            if ward_num <= 15:
                constituency_name = f"{local_body} Constituency 1"
            else:
                constituency_name = f"{local_body} Constituency 2"

        key = (str(dist_id), constituency_name)
        const_doc = constituencies_to_create[key]
        const_id = const_doc["_id"]

        bulk_updates.append(
            UpdateOne(
                {"_id": ward["_id"]},
                {
                    "$set": {
                        "constituency_id": const_id,
                        "constituency_name": constituency_name,
                        "assembly_constituency_id": const_id,
                        "assembly_constituency_name": constituency_name
                    }
                }
            )
        )

    if bulk_updates:
        print("Bulk writing ward updates...")
        result = await db.wards.bulk_write(bulk_updates)
        print(f"Bulk write completed: matched {result.matched_count}, modified {result.modified_count}.")

    # Print Chennai constituencies
    print("\nChennai Constituencies:")
    async for c in db.constituencies.find({"district_id": chennai_id}):
        ward_count = await db.wards.count_documents({"constituency_id": c["_id"]})
        print(f" - {c['name']} (ID: {c['_id']}): {ward_count} wards")

if __name__ == "__main__":
    asyncio.run(main())
