from pydantic_settings import BaseSettings
from typing import Optional
import os

backend_env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))


class Settings(BaseSettings):
    APP_NAME: str = "Civifix"

    ENV: str = "development"

    API_V1_PREFIX: str = "/api/v1"

    MONGODB_URL: str

    DATABASE_NAME: str

    JWT_SECRET_KEY: str

    JWT_REFRESH_SECRET: str

    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    OTP_EXPIRE_MINUTES: int = 5

    OTP_MAX_ATTEMPTS: int = 5

    OTP_COOLDOWN_MINUTES: int = 3

    OTP_MAX_RESEND: int = 3

    SMTP_HOST: Optional[str] = None

    SMTP_PORT: Optional[int] = 587

    SMTP_USERNAME: Optional[str] = None

    SMTP_PASSWORD: Optional[str] = None

    SENDER_EMAIL: Optional[str] = None

    SENDER_NAME: str = "Civifix"

    CORS_ORIGINS: list = ["*"]

    LOG_LEVEL: str = "INFO"

    GEMINI_API_KEY: Optional[str] = None
    BLOCK_UNRELATED_CIVIC_ISSUES: bool = False

    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None
    GOOGLE_CLOUD_PROJECT: Optional[str] = None
    NLP_REOPEN_THRESHOLD: float = -0.3

    class Config:
        env_file = backend_env_path if os.path.exists(backend_env_path) else ".env"
        extra = "ignore"

settings = Settings()
