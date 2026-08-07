import logging
import asyncio
from typing import Dict, Any, List, Optional
from google.genai import types
from google.genai.errors import APIError
from pydantic import BaseModel, Field
from app.ai.gemini_client import get_gemini_client

logger = logging.getLogger(__name__)

class DuplicateCheckResult(BaseModel):
    duplicate: bool = Field(description="True if the new complaint is a duplicate of one of the existing complaints (describes the same specific civic issue/event). False otherwise.")
    matched_complaint_id: Optional[str] = Field(None, description="The custom string Complaint ID or MongoDB ObjectId of the matched duplicate complaint (e.g. CFX-20260803-00127) if duplicate is True.")
    similarity: Optional[int] = Field(None, description="Similarity percentage between 0 and 100 representing how closely the two complaints match in meaning.")
    reason: Optional[str] = Field(None, description="Explanation for why this is a duplicate or unique complaint.")

async def detect_duplicate_complaint(
    new_complaint: Dict[str, Any],
    existing_complaints: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Compare a new complaint against a list of existing complaints using Gemini AI to detect duplicates.
    Retries once on API error.
    """
    fallback = {"duplicate": False}
    
    # Filter to active statuses only
    active_statuses = {"PENDING", "OPEN", "ASSIGNED", "IN_PROGRESS", "WORKING", "UNDER_REVIEW", "ACCEPTED", "FIELD_VISIT"}
    existing_complaints = [
        c for c in existing_complaints 
        if str(c.get("status") or "").upper() in active_statuses
    ]

    if not existing_complaints:
        logger.info("[AI Duplicate Detection] No active complaints to compare. Skipping.")
        return fallback

    client = get_gemini_client()
    if not client:
        logger.warning("Gemini client is not available. Skipping duplicate detection.")
        return fallback

    # Prepare existing complaints description for the model
    existing_str = ""
    for c in existing_complaints:
        c_id = c.get("complaint_id") or c.get("complaintId") or str(c.get("_id", ""))
        existing_str += (
            f"Complaint ID: {c_id}\n"
            f"Category: {c.get('complaint_type') or c.get('complaintType')}\n"
            f"Description: {c.get('description') or c.get('complaintDescription')}\n"
            f"Created Date: {c.get('created_at') or c.get('createdAt')}\n"
            f"Status: {c.get('status')}\n\n"
        )

    prompt = (
        "Compare the following new complaint against the list of existing complaints to determine if it is a duplicate (describing the same specific civic issue/event).\n\n"
        "New Complaint Details:\n"
        f"Category: {new_complaint.get('category')}\n"
        f"Description: {new_complaint.get('description')}\n"
        f"District: {new_complaint.get('district')}\n"
        f"Ward: {new_complaint.get('ward')}\n\n"
        "Existing Complaints in Same District and Ward:\n"
        f"{existing_str}"
        "Instructions:\n"
        "1. Two complaints are duplicates if they describe the same specific issue/incident at the same general location (e.g. garbage pile at a specific school entrance, pothole in front of a specific shop, leaking pipe on a specific street).\n"
        "2. Do not match solely because they share a category. They must be the same issue.\n"
        "3. Set duplicate to true, matched_complaint_id, similarity (0-100), and reason if duplicate is found. Otherwise set duplicate to false."
    )

    models_to_try = [
        'gemini-3.5-flash',
        'gemini-3.6-flash',
        'gemini-flash-latest',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite'
    ]

    for model_name in models_to_try:
        try:
            loop = asyncio.get_running_loop()
            def call_gemini():
                return client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=DuplicateCheckResult,
                    ),
                )
            
            response = await asyncio.wait_for(
                loop.run_in_executor(None, call_gemini),
                timeout=15.0
            )
            
            result_text = response.text
            logger.info(f"Gemini duplicate detection response from {model_name}: {result_text}")
            parsed = DuplicateCheckResult.parse_raw(result_text)
            
            return {
                "duplicate": parsed.duplicate,
                "matched_complaint_id": parsed.matched_complaint_id if parsed.duplicate else None,
                "similarity": parsed.similarity if parsed.duplicate else None,
                "reason": parsed.reason if parsed.duplicate else None
            }
        except Exception as e:
            logger.error(f"Duplicate detection failed with model {model_name}: {str(e)}")
            
    logger.error("All duplicate detection attempts and models failed. Defaulting to unique complaint.")
    return fallback
