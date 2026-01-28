from fastapi import APIRouter,Depends,HTTPException
from app.schemas.user import UserCreate 
from sqlalchemy.orm import Session
from app.db.session import get_db


router = APIRouter(prefix="/auth")

# @router.post("/register")
# async def register(user:UserCreate,db:Session=Depends(get_db)):
#     try:
#         user = await db.add(user)
#         print(user)
#     except:
#         raise HTTPException(status_code=400,detail="User registration Failed")
    
