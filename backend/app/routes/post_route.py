from fastapi import APIRouter,Depends,File,Form,UploadFile,HTTPException
from app.schemas.post_schema import PostCreate
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.post_model import Post
from app.deps.auth_dep import get_current_user
from app.utils.imagekit import upload_file_on_imagekit
from app.schemas.post_schema import PostUpdate

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
        
        
@router.get("/")
def get_posts(user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        posts = db.query(Post).all()
        return {
                "message":"Posts fetched successfully",
                "data":posts,
                "success":True
            }
    except HTTPException as e:
        db.rollback()
        print(str(e))
        raise HTTPException(status_code=500,detail=str(e))
        
@router.patch("/{id}")
async def update_post(
    id:int,
    title: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db:Session=Depends(get_db)
    ):
    try:
        existed_post = db.query(Post).filter(Post.id == id).first()
        
        if not existed_post:
            raise HTTPException(status_code=404,detail="Post not found")
        
        if existed_post.user_id != user.id:
            raise HTTPException(status_code=400,detail="You are not authenicated to update this post")
        else:
            if file:
                uploaded = await upload_file_on_imagekit(file)
                existed_post.file = uploaded["url"]
                
            if title:
                existed_post.title = title
            if description:
                existed_post.description = description
                
            db.commit()
            db.refresh(existed_post)
            return {
                "message":"Post updated successfully",
                "data":existed_post,
                "success":True
            }
    except HTTPException as e:
        db.rollback()
        print(str(e))
        raise HTTPException(status_code=500,detail=str(e))
    

@router.delete("/{id}")
async def delete_post(id:int,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        existed_post = db.query(Post).filter(Post.id == id).first()
        if not existed_post:
            raise HTTPException(status_code=404,detail="Post not found")
        
        if existed_post.user_id != user.id:
            raise HTTPException(status_code=401,detail="You are not authorized to delted this post")
        
        copy_post = existed_post
        db.delete(existed_post)
        db.commit()
        
        return {
            "message":"Post deleted successfully",
            "data":copy_post,
            "success":True
        }
    except HTTPException as e:
       db.rollback()
       print(str(e))
       raise HTTPException(status_code=500,detail=str(e))
   