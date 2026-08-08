import os
import logging
from google.cloud import language_v1

logger = logging.getLogger(__name__)

# Configurable reopening threshold (default -0.3)
NLP_REOPEN_THRESHOLD = float(os.getenv("NLP_REOPEN_THRESHOLD", "-0.3"))


def analyze_sentiment(text: str) -> dict:
    """
    Analyzes feedback text sentiment using Google Cloud Natural Language API.
    
    Returns:
    {
        "sentiment_score": float,       # -1.0 (extremely negative) to +1.0 (extremely positive)
        "sentiment_magnitude": float,   # 0.0 to +inf (strength of emotion)
        "sentiment_classification": str,# "POSITIVE", "NEUTRAL", or "NEGATIVE"
        "should_reopen": bool,          # True if sentiment_score < NLP_REOPEN_THRESHOLD
        "threshold_used": float,
        "provider": str
    }
    """
    threshold = float(os.getenv("NLP_REOPEN_THRESHOLD", "-0.3"))

    # Ensure GOOGLE_APPLICATION_CREDENTIALS points to valid file if set in project root
    cred_file = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_file or not os.path.exists(cred_file):
        default_cred = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../credentials/civifix-nlp-e7f43fbd6553.json"))
        if os.path.exists(default_cred):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = default_cred

    try:
        client = language_v1.LanguageServiceClient()
        document = language_v1.Document(
            content=text,
            type_=language_v1.Document.Type.PLAIN_TEXT
        )
        annotations = client.analyze_sentiment(request={"document": document})
        score = float(annotations.document_sentiment.score)
        magnitude = float(annotations.document_sentiment.magnitude)

        if score < -0.1:
            classification = "NEGATIVE"
        elif score > 0.1:
            classification = "POSITIVE"
        else:
            classification = "NEUTRAL"

        should_reopen = score < threshold

        logger.info(f"[Google Cloud NLP] Sentiment Score: {score:.3f}, Magnitude: {magnitude:.3f}, Classification: {classification}, Should Reopen: {should_reopen}")

        return {
            "sentiment_score": round(score, 3),
            "sentiment_magnitude": round(magnitude, 3),
            "sentiment_classification": classification,
            "should_reopen": should_reopen,
            "threshold_used": threshold,
            "provider": "GOOGLE_CLOUD_NATURAL_LANGUAGE"
        }
    except Exception as e:
        logger.error(f"[Google Cloud NLP] Sentiment Analysis Error: {str(e)}")
        # Fallback heuristic if API credentials/connection fail
        lower = text.lower()
        if any(w in lower for w in ["bad", "worst", "not fixed", "terrible", "poor", "disaster", "danger", "dirty", "uncleaned", "broken", "failed"]):
            score = -0.6
            classification = "NEGATIVE"
        elif any(w in lower for w in ["good", "great", "excellent", "perfect", "fixed", "thanks", "clean", "smooth"]):
            score = 0.6
            classification = "POSITIVE"
        else:
            score = 0.0
            classification = "NEUTRAL"

        should_reopen = score < threshold

        return {
            "sentiment_score": score,
            "sentiment_magnitude": 0.5,
            "sentiment_classification": classification,
            "should_reopen": should_reopen,
            "threshold_used": threshold,
            "provider": "FALLBACK"
        }
