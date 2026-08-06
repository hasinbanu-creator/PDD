import logging
import asyncio
import traceback
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from google.genai import types
from google.genai.errors import APIError

from app.ai.gemini_client import get_gemini_client
from app.core.config import settings

logger = logging.getLogger(__name__)

class ImageVerificationResult(BaseModel):
    contains_civic_issue: bool = Field(description="True if the image clearly depicts a civic/municipal issue (e.g. pothole, broken road, garbage pile, street light issue, drainage overflow, water leakage, tree cutting, illegal construction, etc.). False otherwise.")
    predicted_category: str = Field(description="The predicted category of the civic issue if present. Must be one of: ROAD_DAMAGE, POTHOLE, GARBAGE, STREETLIGHT, WATER_SUPPLY, DRAINAGE, SANITATION, TREE_CUTTING, CONSTRUCTION, OTHER.")
    confidence: float = Field(description="Confidence score of the prediction between 0.0 and 1.0.")
    reason: str = Field(description="A brief explanation for the decision.")
    is_low_quality: bool = Field(description="True if the image is too blurry, dark, low resolution, or unclear for AI verification. False otherwise.")

async def verify_complaint_image(image_bytes: bytes, mime_type: str) -> Dict[str, Any]:
    """
    Sends the image bytes to Google Gemini for civic issue verification and classification.
    Returns a dictionary matching the response schema, along with should_allow_submission.
    Uses a timeout of 30 seconds.
    """
    # Default fallback response if Gemini fails or is unavailable
    fallback = {
        "contains_civic_issue": True,  # Allow by default if API fails
        "predicted_category": "OTHER",
        "confidence": 1.0,
        "reason": "AI verification skipped or failed. Defaulting to allow.",
        "should_allow_submission": True,
        "is_low_quality": False,
        "api_status": "SKIPPED"
    }

    # Log step 1: Image received, size, MIME type
    image_size = len(image_bytes)
    logger.info(f"[AI Image Verification] Image received. Size: {image_size} bytes, MIME type: {mime_type}")

    try:
        import os
        from google import genai
        api_key = getattr(settings, "GEMINI_API_KEY", None)
        if not api_key:
            api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)
    except Exception as init_err:
        tb = traceback.format_exc()
        logger.error(f"[AI Image Verification] Failed to initialize Gemini client:\n{tb}")
        return {**fallback, "api_status": "FAILED", "error_details": f"Failed to initialize Gemini client: {str(init_err)}"}

    try:
        # Prepare the image part
        logger.info("[AI Image Verification] Converting image bytes to GenAI SDK Part...")
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        logger.info("[AI Image Verification] Image converted successfully.")
        
        prompt = (
            "Analyze this image and determine if it represents a civic/municipal issue (e.g. pothole, damaged road, "
            "garbage accumulation, broken street light, drainage leakage, water supply issue, tree cutting, "
            "illegal or unsafe construction, etc.).\n\n"
            "Instructions:\n"
            "1. Determine contains_civic_issue: true if yes, false if the image does not represent a civic issue (e.g. it is a selfie, person, pet, vehicle interior, food, random object, etc.).\n"
            "2. Identify predicted_category: Must be one of ROAD_DAMAGE, POTHOLE, GARBAGE, STREETLIGHT, WATER_SUPPLY, DRAINAGE, SANITATION, TREE_CUTTING, CONSTRUCTION, OTHER.\n"
            "3. Check confidence: A confidence score between 0.0 and 1.0.\n"
            "4. Assess if the image is low quality: set is_low_quality to true if the image is too blurry, dark, low resolution, or unclear for verification, otherwise false."
        )

        models_to_try = [
            'gemini-3.5-flash',
            'gemini-3.6-flash',
            'gemini-flash-latest',
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite'
        ]
        response = None
        last_err = None
        
        for model_name in models_to_try:
            try:
                logger.info(f"[AI Image Verification] Preparing Gemini request. Model: {model_name}, Prompt length: {len(prompt)}")
                logger.info(f"[AI Image Verification] Sending async request to Gemini using model {model_name}...")
                
                response = await asyncio.wait_for(
                    client.aio.models.generate_content(
                        model=model_name,
                        contents=[image_part, prompt],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=ImageVerificationResult,
                        ),
                    ),
                    timeout=30.0
                )
                logger.info(f"[AI Image Verification] Gemini request succeeded with model: {model_name}")
                break
            except Exception as model_err:
                last_err = model_err
                tb = traceback.format_exc()
                logger.warning(f"[AI Image Verification] Model {model_name} failed. Traceback:\n{tb}")
                
        if response is None:
            if last_err:
                raise last_err
            raise Exception("All Gemini models failed to generate content.")
        
        # Parse output
        result_text = response.text
        logger.info(f"[AI Image Verification] Raw Gemini response text: {result_text}")
        
        try:
            parsed = ImageVerificationResult.parse_raw(result_text)
            logger.info(f"[AI Image Verification] Parsed JSON response successfully: {parsed}")
        except Exception as parse_err:
            tb = traceback.format_exc()
            logger.error(f"[AI Image Verification] Failed to parse raw response as ImageVerificationResult. Raw text:\n{result_text}\nParse error traceback:\n{tb}")
            raise parse_err
        
        # Determine should_allow_submission based on contains_civic_issue and configuration
        block_unrelated = getattr(settings, "BLOCK_UNRELATED_CIVIC_ISSUES", False)
        should_allow = True
        if not parsed.contains_civic_issue or parsed.is_low_quality:
            should_allow = not block_unrelated

        return {
            "contains_civic_issue": parsed.contains_civic_issue,
            "predicted_category": parsed.predicted_category,
            "confidence": parsed.confidence,
            "reason": parsed.reason,
            "is_low_quality": parsed.is_low_quality,
            "should_allow_submission": should_allow,
            "api_status": "SUCCESS"
        }

    except asyncio.TimeoutError as timeout_err:
        tb = traceback.format_exc()
        logger.error(f"[AI Image Verification] Timeout reached during Gemini image verification:\n{tb}")
        return {**fallback, "api_status": "TIMEOUT", "error_details": "Timeout reached during Gemini image verification."}
    except APIError as api_err:
        tb = traceback.format_exc()
        logger.error(f"[AI Image Verification] Gemini API error during image verification:\n{tb}")
        return {**fallback, "api_status": "API_ERROR", "api_error_details": str(api_err), "error_details": f"Gemini API returned error: {str(api_err)}"}
    except Exception as e:
        tb = traceback.format_exc()
        logger.error(f"[AI Image Verification] Unexpected exception during Gemini image verification:\n{tb}")
        return {**fallback, "api_status": "FAILED", "error_details": f"Unexpected error: {str(e)}"}
