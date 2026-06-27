from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "AI SQL Assistant Backend"
    DEBUG: bool = True
    
    # Database Config (Default to sqlite for easy dev, swap to mysql/postgresql in production)
    DATABASE_URL: str = "sqlite:///./sql_assistant.db"
    POSTGRES_URL: str | None = None
    MYSQL_URL: str | None = None
    
    # Ollama / LLM Config
    OLLAMA_API_URL: str = "http://localhost:11434/api/generate"
    OLLAMA_MODEL: str = "llama3"
    
    # Security / Rules
    ALLOW_EXECUTION: bool = True
    MAX_ROWS_RETURNED: int = 100

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
