"""Email service for sending emails"""

import logging
from email.message import EmailMessage
from email.utils import make_msgid, formatdate
from typing import Optional
import traceback
import sys
import os
import asyncio
from bson import ObjectId

import aiosmtplib

from app.core.config import settings

# Configure detailed logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)


class EmailService:
    """Service for sending emails"""

    @staticmethod
    async def send_email(
        to_email: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> bool:
        """Send email"""
        
        logger.info(f"Attempting to send email to {to_email}")
        logger.debug(f"SMTP Config -> HOST: {settings.SMTP_HOST}, PORT: {settings.SMTP_PORT}, USER: {settings.SMTP_USERNAME}")

        try:
            message = EmailMessage()
            
            # Use SENDER_EMAIL or SMTP_USERNAME
            sender_address = settings.SENDER_EMAIL or settings.SMTP_USERNAME
            sender = f"{settings.SENDER_NAME} <{sender_address}>" if settings.SENDER_NAME else sender_address
            message["From"] = sender
            message["To"] = to_email
            message["Subject"] = subject
            
            # Add crucial headers to prevent silent dropping by Gmail/Spam filters
            message["Date"] = formatdate(localtime=True)
            message["Message-ID"] = make_msgid(domain=settings.SMTP_HOST or "civifix.com")

            if html_body:
                message.add_alternative(html_body, subtype="html")
            else:
                message.set_content(body)

            logger.info(f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            logger.info("SMTP connection established.")
            
            # Send the email
            send_result = await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                start_tls=True,
                username=settings.SMTP_USERNAME,
                password=settings.SMTP_PASSWORD,
                timeout=10  # Add timeout
            )
            
            logger.info(f"Email sent successfully to {to_email}")
            logger.info(f"Email sent successfully to {to_email}. Result: {send_result}")
            return True

        except aiosmtplib.SMTPException as smtp_exc:
            logger.error(f"SMTP Exception while sending email to {to_email}: {str(smtp_exc)}")
            logger.error(traceback.format_exc())
            raise smtp_exc
        except Exception as e:
            logger.error(f"Unexpected Exception while sending email to {to_email}: {str(e)}")
            logger.error(traceback.format_exc())
            raise e

    @staticmethod
    async def send_otp_email(to_email: str, otp: str) -> bool:
        """Send OTP email"""

        subject = "Civifix - OTP Verification"

        body = f"""
Your Civifix OTP verification code is: {otp}

This code will expire in 5 minutes.

If you did not request this code, please ignore this email.

Best regards,
Civifix Team
"""

        return await EmailService.send_email(to_email, subject, body)

    @staticmethod
    async def send_login_otp_email(to_email: str, otp: str) -> bool:
        """Send login OTP email"""

        subject = "Civifix - Login OTP"

        body = f"""
Your Civifix login OTP is: {otp}

This code will expire in 5 minutes.

If you did not request this code, please ignore this email.

Best regards,
Civifix Team
"""

        return await EmailService.send_email(to_email, subject, body)

    @staticmethod
    def get_html_template(
        title: str,
        description: str,
        complaint: dict,
        status_badge_color: str,
        status_badge_label: str
    ) -> str:
        """Generates modern, responsive HTML email template for CiviFix notifications"""
        complaint_id = complaint.get("complaint_id") or "N/A"
        category = complaint.get("complaint_type", "Civic Issue")
        district = complaint.get("district", "N/A")
        ward = complaint.get("ward_name", "N/A")
        address = complaint.get("address", "N/A")
        landmark = complaint.get("landmark")
        address_display = f"{address} (Landmark: {landmark})" if landmark else address
        
        date_val = complaint.get("created_at")
        if date_val:
            if isinstance(date_val, str):
                date_str = date_val
            else:
                date_str = date_val.strftime("%d/%m/%Y %H:%M")
        else:
            date_str = "N/A"

        # View Complaint Button
        public_url = os.environ.get("CIVIFIX_PUBLIC_URL")
        button_html = ""
        if public_url:
            view_url = f"{public_url.rstrip('/')}/complaints/{complaint.get('complaint_id') or ''}"
            button_html = f"""
            <div style="text-align: center; margin: 30px 0;">
                <a href="{view_url}" style="background-color: #0052CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Complaint</a>
            </div>
            """

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #F3F4F6;
            margin: 0;
            padding: 0;
        }}
        .email-container {{
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            border: 1px solid #E5E7EB;
        }}
        .header {{
            background-color: #0052CC;
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
        }}
        .header h1 {{
            margin: 10px 0 0 0;
            font-size: 24px;
            font-weight: 800;
        }}
        .content {{
            padding: 30px 20px;
            color: #374151;
        }}
        .greeting {{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }}
        .message {{
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 25px;
        }}
        .info-card {{
            background-color: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }}
        .info-title {{
            font-size: 13px;
            font-weight: 800;
            color: #9CA3AF;
            text-transform: uppercase;
            margin-bottom: 15px;
            letter-spacing: 0.05em;
        }}
        .info-row {{
            margin-bottom: 12px;
            font-size: 14px;
        }}
        .info-label {{
            font-weight: bold;
            color: #4B5563;
            display: inline-block;
            width: 120px;
            vertical-align: top;
        }}
        .info-value {{
            color: #111827;
            display: inline-block;
            width: calc(100% - 130px);
            word-break: break-word;
            vertical-align: top;
        }}
        .status-badge {{
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background-color: {status_badge_color};
        }}
        .footer {{
            background-color: #F9FAFB;
            padding: 30px 20px;
            text-align: center;
            font-size: 13px;
            color: #6B7280;
            border-top: 1px solid #E5E7EB;
            line-height: 1.5;
        }}
        .footer a {{
            color: #0052CC;
            text-decoration: none;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div style="font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff;">CiviFix</div>
            <h1>{title}</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello {complaint.get("citizen_name") or "Citizen"},</div>
            <div class="message">{description}</div>
            
            <div class="info-card">
                <div class="info-title">Complaint Details</div>
                
                <div class="info-row">
                    <span class="info-label">Complaint ID:</span>
                    <span class="info-value" style="font-family: monospace; font-weight: bold;">{complaint_id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span class="info-value">{category}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">District:</span>
                    <span class="info-value">{district}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Ward:</span>
                    <span class="info-value">{ward}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">{address_display}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date & Time:</span>
                    <span class="info-value">{date_str}</span>
                </div>
                <div class="info-row" style="margin-bottom: 0;">
                    <span class="info-label">Current Status:</span>
                    <span class="info-value">
                        <span class="status-badge">{status_badge_label}</span>
                    </span>
                </div>
            </div>

            {button_html}
        </div>
        
        <div class="footer">
            <p style="font-weight: bold; margin-bottom: 5px; color: #374151;">CiviFix Support</p>
            <p style="margin: 0 0 15px 0;">Email: <a href="mailto:civifix.support@gmail.com">civifix.support@gmail.com</a></p>
            <p style="margin: 0; font-style: italic;">Thank you for helping build a cleaner and safer community.</p>
        </div>
    </div>
</body>
</html>
"""
        return html

    @staticmethod
    async def send_complaint_notification(
        complaint_id_or_doc,
        event_type: str,
        reject_reason: Optional[str] = None
    ) -> bool:
        """Fetch details and send complaint update notification email"""
        try:
            # 1. Resolve complaint document
            complaint = None
            if isinstance(complaint_id_or_doc, dict):
                complaint = complaint_id_or_doc
            else:
                from app.db.mongodb import db
                complaint = await db.complaints.find_one({"_id": ObjectId(str(complaint_id_or_doc))})
            
            if not complaint:
                logger.error(f"Complaint {complaint_id_or_doc} not found for notification")
                return False

            # 2. Fetch citizen user
            user_id = complaint.get("user_id")
            if not user_id:
                logger.error(f"No user_id associated with complaint {complaint.get('complaint_id')}")
                return False
                
            from app.db.mongodb import db
            logger.info(f"Fetching citizen email for user_id: {user_id}")
            citizen = await db.users.find_one({"_id": ObjectId(str(user_id))})
            if not citizen:
                logger.error(f"Citizen {user_id} not found for complaint {complaint.get('complaint_id')}")
                return False

            to_email = citizen.get("email")
            logger.info(f"Recipient email address: {to_email}")
            if not to_email:
                logger.info(f"Citizen {citizen.get('name')} does not have an email. Skipping email notification.")
                return False

            citizen_name = citizen.get("name") or "Citizen"

            # 3. Resolve district name
            district_id = complaint.get("district_id")
            district_name = "N/A"
            if district_id:
                try:
                    district_doc = await db.districts.find_one({"_id": ObjectId(str(district_id))})
                    if not district_doc:
                        district_doc = await db.districts.find_one({"_id": str(district_id)})
                    if district_doc:
                        district_name = district_doc.get("name") or "N/A"
                except Exception:
                    pass

            # 4. Resolve ward name
            ward_id = complaint.get("ward_id")
            ward_name = "N/A"
            if ward_id:
                try:
                    ward_doc = await db.wards.find_one({"_id": ObjectId(str(ward_id))})
                    if not ward_doc:
                        ward_doc = await db.wards.find_one({"_id": str(ward_id)})
                    if ward_doc:
                        ward_name = ward_doc.get("name") or "N/A"
                except Exception:
                    pass

            # Format fields for bodies
            complaint_id = complaint.get("complaint_id") or str(complaint.get("_id"))
            category = complaint.get("complaint_type", "Civic Issue").replace("_", " ").title()
            address = complaint.get("address", "N/A")
            landmark = complaint.get("landmark")
            address_display = f"{address} (Landmark: {landmark})" if landmark else address

            # 5. Populate template values based on event type
            event_type = event_type.upper()
            
            if event_type == "SUBMITTED":
                subject = "CiviFix – Complaint Submitted Successfully"
                body = f"""Hello {citizen_name},

Your complaint has been submitted successfully.

Complaint ID:
{complaint_id}

Category:
{category}

Location:
{address_display}

Current Status:
Pending

Our team will review and assign your complaint shortly.

Thank you,
CiviFix Support"""
                title = "Complaint Submitted Successfully"
                description = "Your complaint has been submitted successfully. Our team will review and assign your complaint shortly."
                badge_label = "Pending"
                badge_color = "#F59E0B"

            elif event_type == "ASSIGNED":
                subject = "CiviFix – Complaint Assigned"
                body = f"""Hello {citizen_name},

Your complaint has been assigned to an inspector.

Complaint ID:
{complaint_id}

The inspector will begin reviewing your complaint soon.

Track your complaint anytime in the CiviFix application.

Thank you,
CiviFix Support"""
                title = "Complaint Assigned"
                description = "Your complaint has been assigned to an inspector. The inspector will begin reviewing your complaint soon. Track your complaint anytime in the CiviFix application."
                badge_label = "Assigned"
                badge_color = "#7C3AED"

            elif event_type == "WORK_STARTED":
                subject = "CiviFix – Work Started"
                body = f"""Hello {citizen_name},

Good news!

An inspector has started working on your complaint.

Complaint ID:
{complaint_id}

Status:
In Progress

You can track further updates inside the CiviFix application.

Thank you,
CiviFix Support"""
                title = "Work Started"
                description = "Good news! An inspector has started working on your complaint. You can track further updates inside the CiviFix application."
                badge_label = "In Progress"
                badge_color = "#2563EB"

            elif event_type == "RESOLVED":
                subject = "CiviFix – Complaint Resolved"
                body = f"""Hello {citizen_name},

Your complaint has been resolved successfully.

Complaint ID:
{complaint_id}

The inspector has completed the work and uploaded a resolution image.

Please log in to CiviFix to:

• View the resolution image
• Review the activity timeline
• Submit your feedback and rating

Thank you for helping improve your community.

CiviFix Support"""
                title = "Complaint Resolved"
                description = "Your complaint has been resolved successfully. The inspector has completed the work and uploaded a resolution image.<br/><br/>Please log in to CiviFix to:<ul><li>View the resolution image</li><li>Review the activity timeline</li><li>Submit your feedback and rating</li></ul>"
                badge_label = "Resolved"
                badge_color = "#059669"

            elif event_type == "REJECTED":
                reason = reject_reason or complaint.get("rejection_reason") or "No reason provided"
                subject = "CiviFix – Complaint Update"
                body = f"""Hello {citizen_name},

Your complaint has been rejected.

Complaint ID:
{complaint_id}

Reason:
{reason}

If you have any questions, please contact:
civifix.support@gmail.com

Thank you,
CiviFix Support"""
                title = "Complaint Rejected"
                description = f"Your complaint has been rejected.<br/><br/><strong>Reason:</strong> {reason}<br/><br/>If you have any questions, please contact: <a href='mailto:civifix.support@gmail.com'>civifix.support@gmail.com</a>"
                badge_label = "Rejected"
                badge_color = "#DC2626"
            else:
                logger.error(f"Unknown email event type: {event_type}")
                return False

            # Create rich HTML content
            html_body = EmailService.get_html_template(
                title=title,
                description=description,
                complaint={
                    "complaint_id": complaint_id,
                    "complaint_type": category,
                    "district": district_name,
                    "ward_name": ward_name,
                    "address": address,
                    "landmark": landmark,
                    "created_at": complaint.get("created_at"),
                    "citizen_name": citizen_name
                },
                status_badge_color=badge_color,
                status_badge_label=badge_label
            )

            # Send actual email
            return await EmailService.send_email(
                to_email=to_email,
                subject=subject,
                body=body,
                html_body=html_body
            )

        except Exception as e:
            logger.error(f"Error compiling / sending complaint notification email: {str(e)}")
            logger.error(traceback.format_exc())
            return False

    @staticmethod
    def send_complaint_notification_background(
        complaint_id_or_doc,
        event_type: str,
        reject_reason: Optional[str] = None
    ):
        """Send complaint notification email asynchronously"""
        async def run():
            try:
                await EmailService.send_complaint_notification(complaint_id_or_doc, event_type, reject_reason)
            except Exception as e:
                logger.error(f"Error in background email notification: {str(e)}")
                
        asyncio.create_task(run())