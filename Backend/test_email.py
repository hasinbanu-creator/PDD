import os
import sys
import asyncio
from datetime import datetime

# Add Backend folder to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Load dotenv manually
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from app.services.email_service import EmailService

# Mock complaint
mock_complaint = {
    "_id": "64c3d7f11b6d859b7247abcd",
    "complaint_id": "CF-2026-88992",
    "user_id": "64c3d7f11b6d859b72471111",
    "complaint_type": "GARBAGE_DUMPING",
    "description": "Large garbage pile near main cross road causing foul smell.",
    "district_id": "64c3d7f11b6d859b72472222",
    "ward_id": "64c3d7f11b6d859b72473333",
    "address": "45 Gandhi Street, Olimugahammedpettai",
    "landmark": "Near Pillayar Temple",
    "status": "PENDING",
    "created_at": datetime.now()
}

async def generate_and_save_previews():
    print("Generating HTML email previews...")
    
    events = ["SUBMITTED", "ASSIGNED", "WORK_STARTED", "RESOLVED", "REJECTED"]
    
    previews_dir = os.path.join(os.path.dirname(__file__), "email_previews")
    os.makedirs(previews_dir, exist_ok=True)
    
    # 1. Generate local files
    for event in events:
        badge_label = "Pending"
        badge_color = "#F59E0B"
        title = "Complaint Submitted Successfully"
        description = "Your complaint has been submitted successfully."
        
        if event == "ASSIGNED":
            badge_label = "Assigned"
            badge_color = "#7C3AED"
            title = "Complaint Assigned"
            description = "Your complaint has been assigned to an inspector."
        elif event == "WORK_STARTED":
            badge_label = "In Progress"
            badge_color = "#2563EB"
            title = "Work Started"
            description = "Good news! An inspector has started working on your complaint."
        elif event == "RESOLVED":
            badge_label = "Resolved"
            badge_color = "#059669"
            title = "Complaint Resolved"
            description = "Your complaint has been resolved successfully."
        elif event == "REJECTED":
            badge_label = "Rejected"
            badge_color = "#DC2626"
            title = "Complaint Rejected"
            description = "Your complaint has been rejected. Reason: Incorrect ward location."
            
        html = EmailService.get_html_template(
            title=title,
            description=description,
            complaint={
                "complaint_id": mock_complaint["complaint_id"],
                "complaint_type": "Garbage Dumping",
                "district": "Puducherry",
                "ward_name": "01 - Olimugahammedpettai",
                "address": mock_complaint["address"],
                "landmark": mock_complaint["landmark"],
                "created_at": mock_complaint["created_at"],
                "citizen_name": "John Doe"
            },
            status_badge_color=badge_color,
            status_badge_label=badge_label
        )
        
        filepath = os.path.join(previews_dir, f"{event.lower()}_preview.html")
        with open(filepath, "w") as f:
            f.write(html)
        print(f"Saved: {filepath}")

    # 2. Optionally send a test email to verify SMTP if email parameter is supplied
    if len(sys.argv) > 1:
        recipient = sys.argv[1]
        print(f"\nSending test email to {recipient}...")
        
        # Override CIVIFIX_PUBLIC_URL for test button link
        os.environ["CIVIFIX_PUBLIC_URL"] = "http://localhost:3000"
        
        from app.db.mongodb import db
        from bson import ObjectId
        
        # Retrieve or create a temporary user in database
        temp_user = await db.users.find_one({"email": recipient})
        if not temp_user:
            temp_user = {
                "_id": ObjectId(),
                "name": "Test Citizen",
                "email": recipient,
                "role": "CITIZEN",
                "mobile_number": "9876543210"
            }
            await db.users.insert_one(temp_user)
            print(f"Created temporary user in DB: {temp_user['_id']}")
        else:
            print(f"Found existing user in DB: {temp_user['_id']}")
            
        mock_complaint["user_id"] = temp_user["_id"]
        
        success = await EmailService.send_complaint_notification(
            complaint_id_or_doc=mock_complaint,
            event_type="RESOLVED"
        )
        print(f"Send status: {'SUCCESS' if success else 'FAILED'}")

if __name__ == "__main__":
    asyncio.run(generate_and_save_previews())
