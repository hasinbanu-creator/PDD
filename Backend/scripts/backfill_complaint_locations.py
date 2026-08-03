"""
Backfill migration script:
Updates all existing complaints that are missing district_name/ward_name
by looking up the values from the districts and wards collections.

Run from the Backend directory:
    python scripts/backfill_complaint_locations.py
"""
import asyncio
import sys
import os

# Allow running from project root or Backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongodb import get_database


async def backfill_complaints():
    db = await get_database()

    # Build lookup maps from wards and districts collections
    print("[1/3] Building wards map...")
    wards = await db.wards.find({}).to_list(length=100000)
    wards_map = {}
    for w in wards:
        wards_map[str(w["_id"])] = {
            "ward_name": w.get("ward_name", ""),
            "district_id": str(w.get("district_id", ""))
        }
    print(f"      Found {len(wards_map)} wards")

    print("[2/3] Building districts map...")
    districts = await db.districts.find({}).to_list(length=10000)
    districts_map = {}
    for d in districts:
        districts_map[str(d["_id"])] = d.get("name", "")
    print(f"      Found {len(districts_map)} districts")

    print("[3/3] Scanning complaints for missing district/ward names...")
    # Scan all complaints and force-update district_name / ward_name from lookup maps
    cursor = db.complaints.find({})

    updated = 0
    skipped = 0
    errors = 0

    async for complaint in cursor:
        cid = str(complaint.get("complaint_id", complaint["_id"]))
        update = {}

        ward_id_raw = complaint.get("ward_id")
        district_id_raw = complaint.get("district_id")

        ward_id_str = str(ward_id_raw) if ward_id_raw else None
        district_id_str = str(district_id_raw) if district_id_raw else None

        # Resolve ward_name
        if ward_id_str and ward_id_str in wards_map:
            w_info = wards_map[ward_id_str]
            w_name = w_info["ward_name"]
            if w_name:
                update["ward_name"] = w_name
                update["wardName"] = w_name

            # If district_id is missing in complaint, infer from ward
            if not district_id_str:
                district_id_str = w_info["district_id"]
                if district_id_str:
                    from bson import ObjectId
                    try:
                        update["district_id"] = ObjectId(district_id_str)
                        update["districtId"] = district_id_str
                    except Exception:
                        pass

        # Resolve district_name
        if district_id_str and district_id_str in districts_map:
            d_name = districts_map[district_id_str]
            if d_name:
                update["district_name"] = d_name
                update["districtName"] = d_name

        if not update:
            skipped += 1
            continue

        try:
            result = await db.complaints.update_one(
                {"_id": complaint["_id"]},
                {"$set": update}
            )
            if result.modified_count > 0:
                updated += 1
                print(f"  OK {cid}: district={update.get('district_name','?')} ward={update.get('ward_name','?')}")
        except Exception as e:
            errors += 1
            print(f"  ERR {cid}: {e}")

    print(f"\nDone. Updated: {updated} | Skipped (no IDs resolved): {skipped} | Errors: {errors}")


if __name__ == "__main__":
    asyncio.run(backfill_complaints())
