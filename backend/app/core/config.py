from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-service-account.json"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    GOOGLE_MAPS_API_KEY: str = ""
    CHROMA_DB_PATH: str = "./data/chroma_db"

    class Config:
        env_file = ".env"

settings = Settings()
