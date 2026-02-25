from pydantic import BaseModel
from typing import Optional

class CreateComment(BaseModel):
    text:str
    parent_comment_id:Optional[int] = None