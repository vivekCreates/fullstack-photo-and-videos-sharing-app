from typing import Any, Optional, Annotated
from pydantic import BaseModel, model_validator



class ApiResponse(BaseModel):
    statusCode: int
    message: str
    data: Optional[Any] = None
    success: bool = False
    
    @model_validator(mode="after")
    def mark_success_true(cls,values):
        if values.statusCode < 400:
            values.success = True
        return values
