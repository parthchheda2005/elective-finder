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

@router.get('/recommended-arts-courses-100-200')
async def get_recommended_arts_courses(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and course.get("faculty_title") == "Faculty of Arts" and int(course.get("course")) < 300]
    query_to_ai = ("Here are all of the Arts Courses at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 arts courses that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}

@router.get('/recommended-arts-courses-300')
async def get_recommended_arts_courses_upper(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and course.get("faculty_title") == "Faculty of Arts" and int(course.get("course")) >= 300]
    query_to_ai = ("Here are all of the Arts Courses at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 arts courses that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}

@router.get('/recommended-science-courses-100-200')
async def get_recommended_science_courses_lower(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and course.get("faculty_title") == "Faculty of Science" and int(course.get("course")) < 300]
    query_to_ai = ("Here are all of the Science Courses at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 science courses that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}

@router.get('/recommended-science-courses-300')
async def get_recommended_science_courses_lower(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and course.get("faculty_title") == "Faculty of Science" and int(course.get("course")) >= 300]
    query_to_ai = ("Here are all of the science Courses at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 science courses that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}

@router.get('/recommend-upper-level-courses-outside-major')
async def get_recommended_upper_level_electives(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    user_major_code = user.get("major_code")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and int(course.get("course")) >= 300 and course.get("subject") != user_major_code]
    query_to_ai = ("Here are all of the Upper Level Courses outside of the user's major at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 Upper Level courses outside of the user's major that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}

@router.get('/recommend-upper-level-courses-in-major')
async def get_recommended_upper_level_electives(user: dict = Depends(get_current_user)):
    user_major = user.get("major")
    user_major_code = user.get("major_code")
    ratings = list_serial(ratings_collection.find({"user_id" : str(user["_id"])})) # get all the ratings by the current user
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL" and int(course.get("course")) >= 300 and course.get("subject") == user_major_code]
    query_to_ai = ("Here are all of the Upper Level Courses In The User's Major at UBC: " + f"{filtered_data} " + 
                   "Here are all the courses the user has done: " + f"{ratings} " 
                   + "Could you recommend 5 Upper Level in the user's major courses that the user is likely to enjoy? " +
                   f"I have provided ratings, which is a metric for user enjoyment, where 1 means least enjoyment and 5 means most enjoyment. The user's major is {user_major}. "
                   "You cannot recommend courses that are already done or that are honors courses. Aviod recommending courses to similar to each other or similar to what the user has done (ex. CPSC259: Data Structures and Algorithms for Electrical Engineers for people who did CPSC221: Basic Algorithms and Data Structures)" +
                   "Please provide your answer as a list of courses, each explaining why the user should take it.")
    response = model.generate_content(query_to_ai)
    text_response = response.text
    return {"Data" : text_response}