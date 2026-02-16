from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.like_model import Like
from app.deps.auth_dep import get_current_user
from app.utils.convert_in_dict import user_to_dict
from app.schemas.response_schema import ApiResponse

router = APIRouter(prefix="/likes")


@router.post("/{post_id}")
def like_or_dislike(
    post_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        liked_post = (
            db.query(Like)
            .filter(Like.post_id == post_id)
            .filter(Like.user_id == user.id)
            .first()
        )

        if liked_post:
            db.delete(liked_post)
            db.commit()
            return ApiResponse(
                statusCode=200, message="Post Disliked successful"
            ).model_dump()
        else:
            new_like = Like(post_id=post_id, user_id=user.id)
            db.add(new_like)
            db.commit()
            return ApiResponse(
                statusCode=200,
                message="Post Liked successful",
                data={
                    "id": new_like.id,
                    "post_id": new_like.post_id,
                    "user_id": new_like.user_id,
                    "created_at":new_like.created_at,
                    "updated_at":new_like.updated_at
                },
            ).model_dump()
    except Exception as e:
        db.rollback()
        print(str(e))
        return ApiResponse(statusCode=500, message=str(e))
