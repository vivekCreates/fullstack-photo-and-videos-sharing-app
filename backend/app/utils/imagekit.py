import os
from imagekitio import ImageKit
from dotenv import load_dotenv
from fastapi import UploadFile, HTTPException

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
)


async def upload_file_on_imagekit(file: UploadFile):
    try:
        file_bytes = await file.read() 

        response = imagekit.files.upload(
            file=file_bytes,
            file_name=file.filename,
            folder="/posts",
        )

        return {
            "file_id": response.file_id,
            "url": response.url,
            "thumbnail_url": response.thumbnail_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
