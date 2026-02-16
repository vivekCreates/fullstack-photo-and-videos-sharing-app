from sqlalchemy import Column, ForeignKey,Integer,String,DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base
from sqlalchemy.sql import func

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer,primary_key=True,index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    post_id = Column(
        Integer,
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=False
    )

    owner = relationship(
        "User",
        back_populates="likes"
    )
    owner = relationship(
        "Post",
        back_populates="likes"
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    