from fastapi import APIRouter,Depends,File,Form,UploadFile,HTTPException
from app.schemas.post_route import PostCreate
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.post_model import Post
from app.deps.auth_dep import get_current_user
from app.utils.imagekit import upload_file_on_imagekit

router = APIRouter(prefix="/posts")

@router.post("/create")
async def create_post(title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db:Session=Depends(get_db)
    ):

    file_url = ""
    if file:
        res =  await upload_file_on_imagekit(file)
        file_url = res["url"]
    
    try:
        new_post = Post(
            title=title,
            description=description,
            file=file_url,
            user_id=user.id
        )
        
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        
        return {
            "message":"Post created successfully",
            "data": new_post,
            "success":True
        }
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail="Post creation failed")
    
    
@router.get("/{id}")
def get_one_post(id:int,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        post = db.query(Post).filter(Post.id==id).first()
        if not post:
            return {
                "message":"Post not found",
                "success":False
            }
        return {
             "message":"Post fetch successfully",
             "success":True,
             "data":post
        }
    except HTTPException as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=505,detail="Post can't get")
        