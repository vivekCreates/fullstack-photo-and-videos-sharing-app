from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth_dep import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.bookmark_model import Bookmark
from app.models.post_model import Post
from app.models.user_model import User
from app.schemas.response_schema import ApiResponse

router = APIRouter(prefix="/bookmarks")


@router.post("/{post_id}")
def add_to_bookmark_and_remove(
    post_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        bookmarked_post = db.query(Bookmark).filter(Bookmark.post_id == post_id).first()
        if not bookmarked_post:
            bookmark = Bookmark(user_id=user.id, post_id=post_id)
            db.add(bookmark)
            db.commit()
            db.refresh(bookmark)
            
            return ApiResponse(
            statusCode=200, message="bookmark successfully", data=bookmark
        ).model_dump()
        else:
            if bookmarked_post.user_id != user.id:
                return ApiResponse(
                    statusCode=400, message="You are not authenticate to delete this post"
                )
            db.delete(bookmarked_post)
            db.commit()
            return ApiResponse(
                statusCode=200,
                message="Bookmark deleted successfully",
            )
    except HTTPException as e:
        print(str(e))
        return ApiResponse(statusCode=500, message=str(e))


@router.get("/")
def get_bookmark_posts(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        bookmarked_posts = (
          db.query(Post.id, Post.file, Post.title)
            .join(Bookmark, Bookmark.post_id == Post.id)
            .filter(Bookmark.user_id == user.id)
            .all()
        )
        
        result = [
        {
            "id": post.id,
            "postImage": post.file,
            "title": post.title
            }
        for post in bookmarked_posts
       ]
        
        if not result:
            return ApiResponse(
                statusCode=404,
                message="Bookmark Posts not found",
            )
        return ApiResponse(
            statusCode=200,
            message="Bookmark posts fetched successfully",
            data=result,
        ).model_dump()
    except HTTPException as e:
        print(str(e))
        return ApiResponse(statusCode=500, message=str(e))

