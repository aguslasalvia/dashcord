from app import app
from core import get_server_config
from database.mongo_database import db
import uvicorn

config = get_server_config()

if __name__ == '__main__':
    db.test_connection()
    uvicorn.run(app, host=config["HOST"], port=config["PORT"], reload=True)
