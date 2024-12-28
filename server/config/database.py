import os
from pymongo import MongoClient
import certifi

client = MongoClient(f"mongodb+srv://{os.environ.get('DB_USERNAME')}:{os.environ.get('DB_PASSWORD')}@cluster0.fc4ef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", tlsCAFile=certifi.where())

db = client.ratings_db
ratings_collection = db["ratings_collection"]
users_collection = db["users_collection"]
