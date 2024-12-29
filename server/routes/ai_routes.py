import google.generativeai as genai
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
import requests
from config.database import ratings_collection
from schema.schemas import list_serial
from auth.auth import get_current_user

load_dotenv()

api_key= os.environ.get('GEMINI_API_KEY')
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

router = APIRouter()

@router.get('/recommended-arts-courses')
async def get_recommended_arts_courses(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and course.get("faculty_title") == "Faculty of Arts"]
    query_to_ai = ("Here are all of the Arts Courses at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 arts courses that the user is likely to enjoy? " +
                   f"I have provided ratings, where 1 means least enjoyment and 5 means most enjoyment, and grades. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. " +
                   "Please provide your answer as a list of courses, each explaining why the user should take it. Also at the very top of your answer indicate what the user's major is")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}