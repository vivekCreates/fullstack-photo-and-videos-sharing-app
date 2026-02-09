from fastapi import FastAPI,Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import user_route
from app.routes import post_route
from app.db.init_db import create_tables
from fastapi.responses import JSONResponse

create_tables()

app = FastAPI(
    title="Photo and Video Sharing app",
    description="api to post photo and videos",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(map(str, error["loc"])),  # Converts tuple path to a string
            "message": error["msg"]
        })
    
    return JSONResponse(
        status_code=400,
        content={
            "status": "error",
            "message": "Validation failed",
            "errors": errors
        }
    )

app.include_router(user_route.router, prefix=settings.API_PREFIX)
app.include_router(post_route.router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {"message": "Welcome to the Photo and Video Sharing app API!"}