from pydantic import BaseModel, EmailStr,Field
from typing import Optional

class UserCreate(BaseModel):
    name: str = Field(...,min_length=3, max_length=50)
    email: EmailStr
    password:str = Field(...,min_length=6, max_length=100)
    profile_image:Optional[str] = None

    
    