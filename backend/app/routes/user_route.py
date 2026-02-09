from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, File
from app.schemas.user_schema import UserCreate, UserLogin
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user_model import User
from app.utils.hash_password import hash_password, verify_password
from app.utils.create_token import create_token
from app.utils.imagekit import upload_file_on_imagekit
from app.deps.auth_dep import get_current_user
from app.schemas.response_schema import ApiResponse
from fastapi.responses import JSONResponse
from app.utils.convert_in_dict import user_to_dict

router = APIRouter(prefix="/auth")


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existed_user = db.query(User).filter(User.email == user.email).first()
        if existed_user:
            return ApiResponse(
                    statusCode=409,
                    message="User already exists"
                )

        hashed_password = hash_password(user.password)
        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_password,
            profile_image=user.profile_image,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return ApiResponse(
                statusCode=200,
                message="User registered successfully",
                data=user_to_dict(new_user)
            ),
        

    except Exception as e:
        db.rollback()
        print(e)
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )
        


@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            return ApiResponse(
                statusCode=400,
                message="Invalid credentials"
            )
   
        if not verify_password(user.password, db_user.password):
            return ApiResponse(
                statusCode=400,
                message="Invalid credentials"
            )
        token = create_token({"email": db_user.email})

        response.set_cookie(
            key="token", value=token, httponly=True, secure=False, samesite="lax"
        )
        return ApiResponse(
                statusCode=200,
                message="Login successful",
                data={"user":user_to_dict(db_user),"token":token}
            )
    except Exception as e:
        db.rollback()
        print(e)
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )
   


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="token", httponly=True, secure=False, samesite="lax")
    return {"message": "Logout successfully", "statusCode": 200}


@router.patch("/upload-avatar")
async def upload_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

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
                "file_url": response["url"],
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
async def get_logged_in_user(
    user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        current_user = db.query(User).filter(User.id == user.id).first()
        if not current_user:
            raise HTTPException(status_code=404, detail="User not found")
        else:
            return {
                "message": "User fetched successfully",
                "data": current_user,
                "success": True,
            }
    except HTTPException as e:
        db.rollback()
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
