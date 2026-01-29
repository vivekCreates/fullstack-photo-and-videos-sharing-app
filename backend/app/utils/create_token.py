from datetime import datetime, timedelta
import jwt
from app.core.config import settings

def create_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=settings.JWT_TOKEN_EXPIRY)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,settings.JWT_TOKEN_SECRET,algorithm=settings.ALGORITHM)
    

def decode_token(token: str):
    return jwt.decode(token, settings.JWT_TOKEN_SECRET, algorithms=[settings.ALGORITHM])