from fastapi import APIRouter,Depends,HTTPException
from app.schemas.user import UserCreate,UserLogin
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.utils.hash_password import hash_password,verify_password
from app.utils.create_token import create_token



router = APIRouter(prefix="/auth")

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existed_user = db.query(User).filter(User.email == user.email).first()
        if existed_user:
            return{
                'statusCode':400,
                'message': 'Email already registered'   
            }
        hashed_password = hash_password(user.password)
        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_password,
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
    
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            return {
                'statusCode': 400,
                'message': 'Invalid email or password'
            }
        if not verify_password(user.password, db_user.password):
            return {
                'statusCode': 400,
                'message': 'Invalid email or password'
            }
        token = create_token({"user_id": db_user.id, "email": db_user.email})
        return {
            'statusCode': 200,
            'message': 'Login successful',
            'token': token
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Login failed")