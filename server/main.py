from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
from routes import user_routes, rating_routes

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


# ROUTES
app.include_router(user_routes.router) # get all routes from user routes
app.include_router(rating_routes.router) # get all routes form rating routes

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