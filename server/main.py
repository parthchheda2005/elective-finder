from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/")
def default_page():
    response = requests.get("https://ubcgrades.com/api/v3/courses/UBCV/2023W/CPSC")
    return response.json()