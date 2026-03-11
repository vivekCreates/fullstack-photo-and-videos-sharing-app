from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps.auth_dep import get_current_user
from app.db.session import get_db
from app.models.followers_model import Follower
from app.schemas.response_schema import ApiResponse


router = APIRouter(prefix="/followers")


@router.post("/{user_id}")
def create_follower(
    user_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)
):
    try:
        already_follow = (
            db.query(Follower).filter(Follower.follow_to == user_id).first()
        )

        if already_follow:
            db.delete(already_follow)
            db.commit()

            return ApiResponse(statusCode=200, message="Unfollow successfully")
        else:
            follower = Follower(follow_to=user_id, follow_by=user.id)

            db.add(follower)
            db.commit()
            db.refresh(follower)

            return ApiResponse(statusCode=200, message="Follow successfully")

    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e),
        )


@router.get("/")
def get_all_followers(user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        all_followers = db.query(Follower).filter(
            Follower.follow_by==user.id
        ).all()
        
        return ApiResponse(
            statusCode=200,
            message="Followers fetch successfully",
            data=all_followers
        ).model_dump()
        
    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e),
        )
        
        