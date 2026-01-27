from sqlalchemy import Column,Integer,String,DateTime
from db.base import Base
from sqlalchemy.sql import func

class User(Base):
    __tableName__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False)
    email = Column(String,nullable=False)
    password = Column(String,nullable=False)
    profile_image = Column(String,nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    