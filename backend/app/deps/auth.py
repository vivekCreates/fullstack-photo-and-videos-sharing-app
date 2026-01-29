from fastapi import Cookie, HTTPException, status
from jose import JWTError
from app.utils.create_token import decode_token

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_token(access_token)
        return payload["token"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
