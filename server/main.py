from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import certifi
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional


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


ratings = [
    {"id": 1, "course": "210", "subject": "CPSC", "grade": 97, "rating": 5},
    {"id": 2, "course": "111", "subject": "CHEM", "grade": 80, "rating": 1},
    {"id": 3, "course": "113", "subject": "SCIE", "grade": 88, "rating": 3},
    {"id": 4, "course": "100", "subject": "LING", "grade": 94, "rating": 2}
]


# Get all courses by subject
@app.get("/courses/{subject}")
def get_courses_by_subject(subject: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/courses/UBCV/2023W/{subject}")
    return {"Data" : response.json()}

# Get data on specific course from subject (ex. average, median, grade distribution)
@app.get("/courses/{subject}/{course}")
def get_course(subject: str, course: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/grades/UBCV/2023W/{subject}/{course}")
    data = response.json()
    my_item = {}
    for item in data:
        if item["section"] == "OVERALL":
            my_item = item
            break
    return my_item

# Get all ratings
@app.get("/ratings")
def get_ratings():
    return {"data" : ratings}

# Get single rating by id
@app.get("/ratings/{id}")
def get_rating_by_id(id: int):
    if (id > len(ratings)):
        return {"Error": "id does not exist"}
    my_rating = {}
    for rating in ratings:
        if rating["id"] == id:
            my_rating = rating
            break
    return my_rating

# Post Rating
class RateSchema(BaseModel):
    id: int = Field(default = None)
    course: str
    subject: str
    grade: int
    rating: int

@app.post("/create-rating")
def create_rating(rating: RateSchema):
    new_rating = rating.dict()
    new_rating["id"] = len(ratings) + 1
    ratings.append(new_rating)
    return {"Info": "Rating added", "Rating": new_rating}

class UpdateRating(BaseModel):
    id: Optional[int] = None
    course: Optional[str] = None
    subject: Optional[str] = None
    grade: Optional[int] = None
    rating: Optional[int] = None

# Update Rating
@app.put("/update-rating/{subject}/{course}")
def update_rating(subject: str, course: str, rating: UpdateRating):
    seen = False
    for courseTaken in ratings:
        if courseTaken["subject"] == subject and courseTaken["course"] == course:
            seen = True
            if rating.grade is not None:
                courseTaken["grade"] = rating.grade
            if rating.rating is not None:
                courseTaken["rating"] = rating.rating
            return {"Info": f"{subject}{course} successfully updated!", "UpdatedRating": courseTaken}
    
    if not seen:
        return {"Error": "You haven't rated this yet"}
    
# Delete Rating 
@app.delete("/delete-rating/{subject}/{course}")
def delete_rating(subject: str, course: str):
    courseToDelete = {}
    for courseTaken in ratings:
        if courseTaken["subject"] == subject and courseTaken["course"] == course:
            courseToDelete = courseTaken
    ratings.remove(courseToDelete)
    return {"Info": "Successfully deleted items!"}