import sys
sys.path.append("/Users/hasinnn/Documents/PDD/Backend")
import asyncio
import json
from app.db.mongodb import get_database
from app.services.jwt_service import JWTService

async def generate():
    db = await get_database()
    user = await db.users.find_one({"email": "citizen@test.com"})
    if not user:
        print("Error: user not found")
        return
    
    user_id = str(user["_id"])
    role = user.get("role", "CITIZEN")
    token_payload = {
        "user_id": user_id,
        "email": user["email"],
        "role": role,
        "district": user.get("district"),
        "type": "access"
    }
    access_token = JWTService.create_access_token(token_payload)
    
    # Find a valid active ward
    ward = await db.wards.find_one({"is_active": True})
    if not ward:
        ward = await db.wards.find_one()
        
    ward_id = str(ward["_id"]) if ward else "60d5ec4b1234567890123456"
    ward_name = ward.get("ward_name", "Ward 1") if ward else "Ward 1"
    district_id = str(ward.get("district_id", "")) if ward else ""
    
    output = {
        "access_token": access_token,
        "user_id": user_id,
        "role": role,
        "email": user["email"],
        "ward_id": ward_id,
        "ward_name": ward_name,
        "district_id": district_id
    }
    
    with open("/Users/hasinnn/Documents/PDD/civifix-frontend/scratch_token.json", "w") as f:
        json.dump(output, f)
    print("Token and ward data generated and saved successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
