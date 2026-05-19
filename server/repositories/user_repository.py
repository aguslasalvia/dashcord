from database import db
from bson import ObjectId


async def login(username: str) -> dict | None:
    user = await db.user_collection.find_one({
        "username": username,
    })

    return user


async def get_user_by_id(id: str) -> dict | None:
    user = await db.user_collection.find_one({
        "_id": ObjectId(id)
    })

    return user
