from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
import urllib.parse



class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # Database parts
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    DATABASE_URL: Optional[str] = None

    ALLOWED_ORIGINS: str = ""

    @property
    def database_url(self) -> str:
        password = urllib.parse.quote_plus(self.DB_PASSWORD)
        return (
            self.DATABASE_URL
            or f"postgresql://{self.DB_USER}:{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return [i.strip() for i in v.split(",")] if v else []

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
