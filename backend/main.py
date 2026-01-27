import uvicorn
from app.app import app



if __name__ == "__main__":
    uvicorn(app,host="localhost",port=8000,reload=True)
