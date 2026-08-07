import sys
sys.path.append("/Users/hasinnn/Documents/PDD/Backend")
import asyncio
import urllib.request
import urllib.error
import json
from datetime import datetime
from app.db.mongodb import get_database
from app.services.jwt_service import JWTService

async def run_diagnostics():
    print("=== STARTING BACKEND E2E DIAGNOSTICS ===")
    
    # 1. Look up citizen user
    db = await get_database()
    user = await db.users.find_one({"email": "citizen@test.com"})
    if not user:
        print("Error: citizen@test.com not found in MongoDB.")
        return
    
    user_id = str(user["_id"])
    role = user.get("role", "CITIZEN")
    print(f"Loaded citizen user: {user['email']} (ID: {user_id}, Role: {role})")
    
    # 2. Generate access token
    token_payload = {
        "user_id": user_id,
        "email": user["email"],
        "role": role,
        "district": user.get("district"),
        "type": "access"
    }
    access_token = JWTService.create_access_token(token_payload)
    print(f"Generated JWT Access Token: {access_token[:30]}...")
    
    # 3. Call GET /auth/me
    print("\n--- Testing GET /api/v1/auth/me ---")
    req_me = urllib.request.Request(
        "http://192.168.1.2:8000/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    try:
        with urllib.request.urlopen(req_me) as response:
            print(f"Status: {response.status}")
            print(f"Body: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")
        
    # 4. Call POST /api/v1/complaints/verify-image
    print("\n--- Testing POST /api/v1/complaints/verify-image ---")
    boundary = "---AxiosBoundary123456789"
    file_content = b"dummy_image_content"
    
    # Construct raw multipart body
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"image\"; filename=\"complaint.jpg\"\r\n"
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode("utf-8") + file_content + f"\r\n--{boundary}--\r\n".encode("utf-8")
    
    req_verify = urllib.request.Request(
        "http://192.168.1.2:8000/api/v1/complaints/verify-image",
        data=body,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req_verify) as response:
            print(f"Status: {response.status}")
            print(f"Body: {response.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(run_diagnostics())
