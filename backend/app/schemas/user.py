from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password:str
    profile_image:Optional[str] = None

    class Config:
        from_attributes = True

    