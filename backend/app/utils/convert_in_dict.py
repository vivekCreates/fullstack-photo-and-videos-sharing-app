def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "profile_image":user.profile_image,         
        "created_at": getattr(user, "created_at", None),
        "updated_at": getattr(user, "updated_at", None),
    }
    
def post_to_dict(post):
    return {
        "id": post.id,
        "title": post.title,
        "file": post.file,
        "user_id":post.user_id,
        "description": post.description,          
        "created_at": getattr(post, "created_at", None),
        "updated_at": getattr(post, "updated_at", None),
    }