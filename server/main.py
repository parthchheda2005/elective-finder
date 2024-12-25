from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Enable CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)



@app.get("/")
def default_page():
    response = requests.get("https://ubcgrades.com/api/v3/courses/UBCV/2023W/CPSC")
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