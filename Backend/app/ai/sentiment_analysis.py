import logging
import asyncio
from typing import Dict, Any
from pydantic import BaseModel, Field
from google.genai import types

from app.ai.gemini_client import get_gemini_client

logger = logging.getLogger(__name__)

# Configurable satisfaction threshold (default 50 out of 100)
SATISFACTION_REOPEN_THRESHOLD = 50.0

class SentimentAnalysisResult(BaseModel):
    sentiment: str = Field(description="Sentiment classification: POSITIVE, NEUTRAL, or NEGATIVE")
    sentiment_score: int = Field(description="Sentiment score as an integer from 0 (extremely negative/dissatisfied) to 100 (extremely positive/satisfied).")
    confidence: int = Field(description="Confidence score of the sentiment analysis from 0 to 100.")
    explanation: str = Field(description="Brief explanation of the sentiment analysis.")


async def analyze_feedback_sentiment(rating: int, feedback_text: str) -> Dict[str, Any]:
    """
    Analyzes citizen feedback text using Gemini NLP.
    Calculates satisfaction score using a weighted formula:
      - 60% Weight: Star Rating Score (rating * 20)
      - 40% Weight: Gemini NLP Sentiment Score (0 - 100)
    
    Returns:
      {
         "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
         "nlp_sentiment_score": float,
         "rating_score": float,
         "satisfaction_score": float,
         "confidence": int,
         "explanation": str,
         "should_reopen": bool
      }
    """
    rating_score = float(max(1, min(5, rating)) * 20)

    fallback_nlp_score = rating_score
    if rating <= 2:
        fallback_sentiment = "NEGATIVE"
    elif rating == 3:
        fallback_sentiment = "NEUTRAL"
    else:
        fallback_sentiment = "POSITIVE"

    fallback = {
        "sentiment": fallback_sentiment,
        "nlp_sentiment_score": fallback_nlp_score,
        "rating_score": rating_score,
        "satisfaction_score": round(0.6 * rating_score + 0.4 * fallback_nlp_score, 2),
        "confidence": 70,
        "explanation": "Rule-based assessment.",
        "should_reopen": (0.6 * rating_score + 0.4 * fallback_nlp_score) < SATISFACTION_REOPEN_THRESHOLD,
        "api_status": "SKIPPED"
    }

    try:
        client = get_gemini_client()
    except Exception as init_err:
        logger.error(f"Failed to initialize Gemini client for sentiment analysis: {str(init_err)}")
        return fallback

    if not client:
        logger.warning("Gemini client unavailable. Using fallback sentiment analysis.")
        return fallback

    prompt = (
        f"Analyze the sentiment and satisfaction level of the following citizen feedback regarding a resolved civic complaint:\n\n"
        f"Star Rating Provided: {rating} out of 5 stars\n"
        f"Feedback Text: \"{feedback_text}\"\n\n"
        f"Instructions:\n"
        f"- Classify sentiment as POSITIVE, NEUTRAL, or NEGATIVE.\n"
        f"- Provide a sentiment_score from 0 (extremely negative/dissatisfied) to 100 (extremely positive/satisfied).\n"
        f"- Provide a confidence score (0 to 100) and a concise explanation."
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
            logger.info(f"Analyzing feedback sentiment with Gemini model {model_name}...")
            loop = asyncio.get_running_loop()

            def call_gemini():
                return client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=SentimentAnalysisResult,
                    ),
                )

            response = await asyncio.wait_for(
                loop.run_in_executor(None, call_gemini),
                timeout=12.0
            )

            result_text = response.text
            logger.info(f"Gemini sentiment response from {model_name}: {result_text}")

            parsed = SentimentAnalysisResult.parse_raw(result_text)

            sentiment = str(parsed.sentiment).strip().upper()
            if sentiment not in ["POSITIVE", "NEUTRAL", "NEGATIVE"]:
                if "NEG" in sentiment:
                    sentiment = "NEGATIVE"
                elif "POS" in sentiment:
                    sentiment = "POSITIVE"
                else:
                    sentiment = "NEUTRAL"

            nlp_score = float(max(0, min(100, parsed.sentiment_score)))
            confidence = int(max(0, min(100, parsed.confidence)))

            # Weighted Formula: 60% Rating + 40% NLP Sentiment
            final_satisfaction_score = round(0.6 * rating_score + 0.4 * nlp_score, 2)
            should_reopen = final_satisfaction_score < SATISFACTION_REOPEN_THRESHOLD

            return {
                "sentiment": sentiment,
                "nlp_sentiment_score": nlp_score,
                "rating_score": rating_score,
                "satisfaction_score": final_satisfaction_score,
                "confidence": confidence,
                "explanation": parsed.explanation,
                "should_reopen": should_reopen,
                "api_status": "SUCCESS"
            }

        except Exception as e:
            logger.error(f"Error during Gemini sentiment analysis with model {model_name}: {str(e)}")

    return fallback
