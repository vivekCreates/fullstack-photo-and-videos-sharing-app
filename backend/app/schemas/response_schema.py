from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel, model_validator,ConfigDict

T = TypeVar("T")

class ApiResponse(BaseModel,Generic[T]):
    statusCode: int
    message: str
    data: Optional[T] = None
    success: bool = False
    
    @model_validator(mode="after")
    def mark_success_true(cls,values):
        if values.statusCode < 400:
            values.success = True
        return values
    
