def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "password": user.password,          # ⚠️ include only if safe!
        "created_at": getattr(user, "created_at", None),
        "updated_at": getattr(user, "updated_at", None),
    }