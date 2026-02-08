from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import user
from app.routes import post
from app.db.init_db import create_tables

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
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix=settings.API_PREFIX)
app.include_router(post.router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {"message": "Welcome to the Photo and Video Sharing app API!"}