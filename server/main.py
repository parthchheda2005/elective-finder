from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import certifi
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Enable CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = f"mongodb+srv://{os.environ.get('DB_USERNAME')}:{os.environ.get('DB_PASSWORD')}@cluster0.fc4ef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where()
)
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


@app.get("/{subject}")
def default_page(subject: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/courses/UBCV/2023W/{subject}")
    return {"Data" : response.json()}

@app.get("/{subject}/{course}")
def get_course(subject: str, course: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/grades/UBCV/2023W/{subject}/{course}")
    data = response.json()
    my_item = {}
    for item in data:
        if item["section"] == "OVERALL":
            my_item = item
            break
    return my_item

