from pydantic import BaseModel
from typing import Optional


class PostCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    
    
class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    
class PostResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    user_id: int
    
    class Config:
        orm_mode = True