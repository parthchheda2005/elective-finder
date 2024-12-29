from fastapi import APIRouter
import requests

router = APIRouter()

# Get all courses by subject
@router.get("/courses/{subject}")
def get_courses_by_subject(subject: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/courses/UBCV/2023W/{subject}")
    return {"Data" : response.json()}

# Get data on specific course from subject (ex. average, median, grade distribution)
@router.get("/courses/{subject}/{course}")
def get_course(subject: str, course: str):
    response = requests.get(f"https://ubcgrades.com/api/v3/grades/UBCV/2023W/{subject}/{course}")
    data = response.json()
    my_item = {}
    for item in data:
        if item["section"] == "OVERALL":
            my_item = item
            break
    return my_item

# Get every course with grade data
@router.get('/courses-all')
def get_all_courses():
    response = requests.get("https://ubcgrades.com/api/v3/grades/UBCV/2023W")
    data = response.json()
    filtered_data = [course for course in data if course.get("section") == "OVERALL"]
    return filtered_data
