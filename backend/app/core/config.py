from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
import urllib.parse


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # Database
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    IMAGEKIT_PRIVATE_KEY: str
    
    DATABASE_URL: Optional[str] = None

    # JWT
    JWT_TOKEN_SECRET: str
    JWT_TOKEN_EXPIRY: int = 15
    ALGORITHM: str = "HS256"

    # CORS (IMPORTANT: str here)
    ALLOWED_ORIGINS: str= "http://localhost:5173"

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL

        password = urllib.parse.quote_plus(self.DB_PASSWORD)
        return (
            f"postgresql://{self.DB_USER}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
