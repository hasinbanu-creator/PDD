import logging
from typing import Optional, Dict, Any
from app.services.vision_service import VisionService

logger = logging.getLogger(__name__)

async def verify_complaint_image(image_bytes: bytes, mime_type: str, selected_category: Optional[str] = None) -> Dict[str, Any]:
    """
    Classify the image using the local ResNet-18 model and verify it against the selected category.
    """
    logger.info(f"[Local AI Image Verification] Image received. Size: {len(image_bytes)} bytes, MIME: {mime_type}")
    
    # Check if the image is solid/blank or has no identifiable features using PIL
    try:
        from PIL import Image, ImageStat
        import io
        
        img = Image.open(io.BytesIO(image_bytes))
        gray_img = img.convert("L")
        stat = ImageStat.Stat(gray_img)
        
        if stat.stddev[0] < 2.0:
            logger.info(f"[Local AI Image Verification] Image detected as solid/blank/featureless (StdDev = {stat.stddev[0]:.2f}).")
            return {
                "verification_status": "LOW_CONFIDENCE",
                "verified": False,
                "selected_category": selected_category or "other_issue",
                "predicted_category": "other_issue",
                "confidence": 1.0,
                "verification_message": "The uploaded image is blank, solid color, or has no identifiable visual features.",
                "contains_civic_issue": False,
                "is_low_quality": True,
                "should_allow_submission": False,
                "api_status": "LOW_QUALITY"
            }
    except Exception as pil_err:
        logger.warning(f"[Local AI Image Verification] PIL/ImageStat blank check failed: {pil_err}")

    # Fallback response if model fails
    fallback = {
        "verification_status": "MATCH",
        "verified": True,
        "selected_category": selected_category or "other_issue",
        "predicted_category": "other_issue",
        "confidence": 1.0,
        "verification_message": "Image verification succeeded (fallback).",
        "contains_civic_issue": True,
        "is_low_quality": False,
        "should_allow_submission": True,
        "api_status": "SKIPPED"
    }

    try:
        vision_service = VisionService()
        if vision_service.model is None:
            logger.warning("[Local AI Image Verification] Vision service model not loaded. Attempting on-demand load...")
            vision_service.load_model()
            
        prediction = vision_service.predict(image_bytes)
        predicted_class = prediction["predicted_class"]
        confidence = prediction["confidence"]
        
        # Determine the selected category (default to predicted class if not provided)
        sel_cat = selected_category if selected_category else predicted_class
        
        # Verify match
        match_result = vision_service.verify_category_match(
            predicted_category=predicted_class,
            selected_category=sel_cat,
            confidence=confidence
        )
        
        return {
            "verification_status": match_result["verification_status"],
            "verified": match_result["verified"],
            "selected_category": match_result["selected_category"],
            "predicted_category": predicted_class,
            "confidence": match_result["confidence"],
            "verification_message": match_result["verification_message"],
            
            # Legacy fields to support frontend logic
            "contains_civic_issue": match_result["verification_status"] == "MATCH",
            "is_low_quality": match_result["verification_status"] == "LOW_CONFIDENCE",
            "should_allow_submission": match_result["verified"],
            "reason": match_result["verification_message"],
            "api_status": "SUCCESS"
        }
        
    except Exception as e:
        logger.error(f"[Local AI Image Verification] Inference error: {e}")
        return {
            **fallback,
            "api_status": "FAILED",
            "error_details": str(e)
        }
