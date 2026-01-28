from fastapi import APIRouter,Depends,HTTPException
from app.schemas.user import UserCreate 
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User


router = APIRouter(prefix="/auth")

@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existed_user = db.query(User).filter(User.email == user.email).first()
        if existed_user:
            return{
                'statusCode':400,
                'message': 'Email already registered'   
            }

        new_user = User(
            name=user.name,
            email=user.email,
            password=user.password,
            profile_image=user.profile_image
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "user_id": new_user.id
        }


    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail="User registration failed")