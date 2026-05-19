from motor.motor_asyncio import AsyncIOMotorClient
from core.config import get_mongo_url


class MongoDatabase:
    def __init__(self):
        mongo_url: str = get_mongo_url()
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client["dashcord"]
        self.playlist_collection = self.db["playlists"]
        self.user_collection = self.db["users"]

    def test_connection(self):
        try:
            
            print("Conection established successfuly with the database.")
            return True
        except Exception as e:
            print(f"Error al conectar a MongoDB: {e}")
            return False


db = MongoDatabase()
