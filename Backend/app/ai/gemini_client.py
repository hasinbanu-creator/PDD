import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None

def get_gemini_client() -> genai.Client:
    """Returns a singleton genai.Client instance initialized with the GEMINI_API_KEY from settings."""
    global _client
    if _client is None:
        api_key = getattr(settings, "GEMINI_API_KEY", None)
        if not api_key:
            import os
            api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY is not set in settings or environment.")
        _client = genai.Client(api_key=api_key)
        logger.info("Initialized Gemini Client singleton.")
    return _client
