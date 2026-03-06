from fastapi import APIRouter,Depends,HTTPException
from app.deps.auth_dep import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.bookmark_model import Bookmark
from app.models.post_model import Post
from app.schemas.response_schema import ApiResponse

router = APIRouter(prefix="/bookmarks")


@router.post("/{post_id}")
def bookmark_post(post_id:int,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        existed_post = db.query(Post).filter(Post.id == post_id).first()
        if not existed_post:
            return ApiResponse(
                statusCode=404,
                message="Post not found",
            )
            
        bookmark = Bookmark(
            user_id=user.id,
            post_id=post_id
        )
        
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)
        
        if not bookmark:
            return ApiResponse(
                statusCode=400,
                message="Failed to bookmark post"
            )
        return ApiResponse(
                statusCode=200,
                message="Post bookmark successfully",
                data=bookmark
            ).model_dump()
    except HTTPException as e:
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )
        
@router.get("/")
def bookmark_post(user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        bookmarked_posts = db.query(Bookmark).filter(Bookmark.user_id == user.id).all()
        if not bookmarked_posts:
            return ApiResponse(
                statusCode=404,
                message="Bookmark Posts not found",
            )
        return ApiResponse(
                statusCode=200,
                message="Bookmark posts fetched successfully",
                data=bookmarked_posts
            ).model_dump()
    except HTTPException as e:
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )