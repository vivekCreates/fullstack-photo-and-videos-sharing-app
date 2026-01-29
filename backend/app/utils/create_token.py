from datetime import datetime, timedelta
import jwt
from core.config import settings

def create_token(data:dict):
    to_encode = data.copy()
    expire = datetime.timezone.utc + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)
    
