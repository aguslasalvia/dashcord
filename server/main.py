from app import app
from database.mongo_database import db
import uvicorn


if __name__ == '__main__':
    db.test_connection()
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
