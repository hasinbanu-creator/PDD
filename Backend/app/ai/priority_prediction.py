import logging
import asyncio
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from google.genai import types
from google.genai.errors import APIError

from app.ai.gemini_client import get_gemini_client

logger = logging.getLogger(__name__)

class PriorityPredictionResult(BaseModel):
    priority: str = Field(description="The predicted priority level. Must be one of: Low, Medium, High.")
    confidence: int = Field(description="Confidence score of the prediction as an integer percentage between 0 and 100.")
    reason: str = Field(description="A brief explanation for the predicted priority level.")

async def predict_complaint_priority(
    category: str,
    description: str,
    district: str,
    ward: str
) -> Dict[str, Any]:
    """
    Sends complaint details to Gemini to predict its priority level.
    Returns a dictionary matching the response schema:
    {
       "priority": "Low" | "Medium" | "High",
       "confidence": int,
       "reason": str
    }
    Enforces a timeout of 10 seconds.
    If Gemini fails, returns fallback: Medium, 0, "AI prediction unavailable."
    """
    fallback = {
        "priority": "Medium",
        "confidence": 0,
        "reason": "AI prediction unavailable.",
        "api_status": "SKIPPED"
    }

    try:
        client = get_gemini_client()
    except Exception as init_err:
        logger.error(f"Failed to initialize Gemini client for priority prediction: {str(init_err)}")
        return fallback

    if not client:
        logger.warning("Gemini client is not available. Skipping priority prediction.")
        return fallback

    prompt = (
        f"Predict the complaint priority (Low, Medium, High) based on the following details:\n\n"
        f"Category: {category}\n"
        f"District: {district}\n"
        f"Ward: {ward}\n"
        f"Description: {description}\n\n"
        f"Instructions:\n"
        f"- Predict priority as 'Low', 'Medium', or 'High' depending on public safety, health hazards, and urgency.\n"
        f"- Provide confidence score (0 to 100) and a brief reason explaining the choice."
    )

    max_retries = 2  # Try once, then retry once
    last_error_details = {}

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Sending request to Gemini for priority prediction (attempt {attempt}/2)...")
            
            loop = asyncio.get_running_loop()
            
            def call_gemini():
                return client.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=PriorityPredictionResult,
                    ),
                )

            response = await asyncio.wait_for(
                loop.run_in_executor(None, call_gemini),
                timeout=30.0
            )
            
            result_text = response.text
            logger.info(f"Gemini priority response text: {result_text}")
            
            parsed = PriorityPredictionResult.parse_raw(result_text)
            
            # Normalize priority to matching PascalCase as requested: "Low", "Medium", "High"
            normalized_priority = str(parsed.priority).strip().capitalize()
            if normalized_priority not in ["Low", "Medium", "High"]:
                if "high" in normalized_priority.lower():
                    normalized_priority = "High"
                elif "low" in normalized_priority.lower():
                    normalized_priority = "Low"
                else:
                    normalized_priority = "Medium"

            return {
                "priority": normalized_priority,
                "confidence": int(parsed.confidence),
                "reason": parsed.reason,
                "api_status": "SUCCESS"
            }

        except asyncio.TimeoutError as timeout_err:
            logger.error(f"Timeout reached during Gemini priority prediction (attempt {attempt}/2).")
            last_error_details = {"api_status": "TIMEOUT", "error_details": str(timeout_err)}
        except APIError as api_err:
            logger.error(f"Gemini API error during priority prediction (attempt {attempt}/2): {str(api_err)}")
            last_error_details = {"api_status": "API_ERROR", "api_error_details": str(api_err)}
        except Exception as e:
            logger.error(f"Unexpected exception during Gemini priority prediction (attempt {attempt}/2): {str(e)}")
            last_error_details = {"api_status": "FAILED", "error_details": str(e)}

    # If both attempts failed, return fallback
    return {**fallback, **last_error_details}
