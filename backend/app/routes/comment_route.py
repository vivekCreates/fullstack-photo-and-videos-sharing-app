from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth_dep import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.comment_model import Comment
from app.schemas.comment_schema import CreateComment,UpdateComment
from app.schemas.response_schema import ApiResponse
from typing import Optional

router = APIRouter(prefix="/comments",)


@router.post("/posts/{post_id}")
def create_Comment(post_id:int,comment:CreateComment,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        comment = Comment(
            post_id=post_id,
            text=comment.text,
            user_id=user.id,
            parent_comment_id=comment.parent_comment_id
        )
        
        db.add(comment)
        db.commit()
        db.refresh(comment)
        
        return ApiResponse(
            statusCode=200,
            message="Comment created successfully",
            data=comment
        ).model_dump()
    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )
        
@router.patch("/{comment_id}")
def update_comment(comment_id:int,comment_body:UpdateComment,user=Depends(get_current_user),db:Session=Depends(get_db)):
    try:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        
        if not comment:
            return ApiResponse(
                statusCode=404,
                message="Comment not found"
            ).model_dump()
            
        comment.text = comment_body.text
        db.commit()
        db.refresh(comment)
        
        return ApiResponse(
                statusCode=201,
                message="Comment updated successfully"
            ).model_dump()
    except HTTPException as e:
        db.rollback()
        print(str(e))
        return ApiResponse(
            statusCode=500,
            message=str(e)
        )