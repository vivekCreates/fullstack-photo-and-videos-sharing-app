from fastapi import APIRouter,Depends,File,Form,UploadFile,HTTPException
from app.schemas.post_schema import PostCreate
from app.db.session import get_db
from sqlalchemy.orm import Session,joinedload
from app.models.post_model import Post
from app.models.user_model import User
from app.deps.auth_dep import get_current_user
from app.utils.imagekit import upload_file_on_imagekit
from app.schemas.post_schema import PostUpdate
from app.schemas.response_schema import ApiResponse
from app.utils.convert_in_dict import post_to_dict


router = APIRouter(prefix="/posts")


@router.get("/current-user")
def get_posts_by_userId(
      user=Depends(get_current_user),
      db: Session = Depends(get_db)
): 
    print("user: ",user)
    current_user_posts = db.query(Post).filter(Post.user_id == user.id).all()

    if not current_user_posts:
        return ApiResponse(
            statusCode=404,
            message="posts not found"
        ).model_dump()
    return ApiResponse(
        message= "posts fetched successfully",
        data= current_user_posts,
        statusCode=200
    ).model_dump()


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
        
        return ApiResponse(
            message="Post created successfully",
            data= post_to_dict(new_post),
            statusCode=200
        ).model_dump()
    except Exception as e:
        db.rollback()
        print(e)
        return ApiResponse(
            message=str(e),
            statusCode=500
        ).model_dump()
    

@router.get("/{id}")
def get_one_post(
    id: int,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        post = (
            db.query(Post, User)
            .filter(Post.id == id)
            .join(User, Post.user_id== User.id)
            .all()
        )

        if not post:
            return ApiResponse(
                message="Post not found",
                statusCode=404
            ).model_dump()
            
        result = []
        for p, u in post:
            result.append({
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "file": p.file,
                "createdAt": p.created_at,
                "updatedAt":p.updated_at,
                "user": {
                    "id": u.id,
                    "name": u.name,
                    "profileImage": u.profile_image,
                }
            })
            

        return ApiResponse(
            message="Post fetch successfully",
            statusCode=200,
            data=result[0]
        ).model_dump()

    except Exception as e:
        return ApiResponse(
            message=str(e),
            statusCode=500
        ).model_dump()  
@router.get("/")
def get_posts(user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        posts = (
            db.query(Post, User)
            .join(User, Post.user_id == User.id)
            .all()
        )

        result = []

        for post, user in posts:
            result.append({
                "id": post.id,
                "title": post.title,
                "description": post.description,
                "file": post.file,
                "createdAt": post.created_at,
                "updatedAt":post.updated_at,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "profileImage": user.profile_image,
                }
            })

        return ApiResponse(
            message="Post created successfully",
            data= result,
            statusCode=200
        ).model_dump()

    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            message=str(e),
            statusCode=500
        ).model_dump()
        
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
            return ApiResponse(
            message="Post not found",
            statusCode=404
        ).model_dump()
        
        if existed_post.user_id != user.id:
            return ApiResponse(
            message="You are not authenicated to update this post",
            statusCode=400
        ).model_dump()
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
            
            return ApiResponse(
            message="Post updated successfully",
            data=post_to_dict(existed_post),
            statusCode=200
        ).model_dump()
    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            message=str(e),
            statusCode=500
        ).model_dump()
    

@router.delete("/{id}")
async def delete_post(id:int,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        existed_post = db.query(Post).filter(Post.id == id).first()
        if not existed_post:
            return ApiResponse(
            message="Post not found",
            statusCode=404
        ).model_dump()
        
        if existed_post.user_id != user.id:
            return ApiResponse(
            message="You are not authenicated to update this post",
            statusCode=400
        ).model_dump()
        
        copy_post = existed_post
        db.delete(existed_post)
        db.commit()
        
        return ApiResponse(
            message="Post deleted successfully",
            statusCode=200,
            data=post_to_dict(copy_post)
        ).model_dump()
       
    except HTTPException as e:
       db.rollback()
       print(str(e))
    return ApiResponse(
            message=str(e),
            statusCode=200,
        ).model_dump()
    

