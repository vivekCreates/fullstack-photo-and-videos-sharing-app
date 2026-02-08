from fastapi import APIRouter,Depends,HTTPException,Response,Request,UploadFile,File
from app.schemas.user import UserCreate,UserLogin
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.utils.hash_password import hash_password,verify_password
from app.utils.create_token import create_token
from app.utils.imagekit import upload_file_on_imagekit
from app.deps.auth import get_current_user

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
def login(user: UserLogin,response:Response, db: Session = Depends(get_db)):
    print("Run login router")
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            return {
                'statusCode': 400,
                'message': 'Invalid email or password'
            }
        if not verify_password(user.password, db_user.password):
            print("After hash password")
            return {
                'statusCode': 400,
                'message': 'Invalid email or password'
            }
        token = create_token({"email": db_user.email})

        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=False,   
            samesite="lax"
        )
        return {
            'statusCode': 200,
            'message': 'Login successful',
            'token': token
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Login failed")
    
    
@router.post("/logout")
def logout(response:Response):
    response.delete_cookie(
            key="token",
            httponly=True,
            secure=False,   
            samesite="lax"
    )
    return {
        'message':"Logout successfully",
        'statusCode':200
    }

@router.post("/upload-avatar")
async def upload_file(file: UploadFile = File(...),user=Depends(get_current_user),db:Session = Depends(get_db)):
    print("user: ",user)
    try:
        response = await upload_file_on_imagekit(file)
        if not response:
            raise HTTPException(status_code=500, detail="File upload failed")
        else:
            user.profile_image = response["url"]
            db.commit()
            db.refresh(user)
            
            return {
                "message": "File uploaded successfully",
                "file_url": response["url"]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    