from typing import Any, Optional
from pydantic import BaseModel, field_validator

class ApiResponse(BaseModel):
    statusCode: int
    message: str
    data: Optional[Any] = None
    success: bool = False 
     
    @field_validator("success", mode="before")
    def set_success(cls, v, info):
        if v is None:
            status = info.data.get("statusCode", 200)
            return status < 400
        return v
