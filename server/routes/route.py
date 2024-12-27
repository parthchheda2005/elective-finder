from fastapi import APIRouter
from models.ratings import Rating
from config.database import collection_name
from schema.schemas import list_serial, individual_serial
from bson import ObjectId

router = APIRouter()

# Get Ratings
@router.get("/ratings")
async def get_ratings():
    ratings = list_serial(collection_name.find())
    return ratings

# Get rating by course
@router.get("/ratings/{subject}/{course}")
async def get_rating_by_course(subject: str, course: str):
    rating = collection_name.find_one({"subject": subject, "course": course})
    if rating:
        serialized_rating = individual_serial(rating)
        serialized_rating['found'] = True
        return serialized_rating
    else:
        return {"found": False, "message": "No rating found for the specified subject and course."}



# Add ratings to DB (post method)
@router.post("/create-rating")
async def create_ratings(rating: Rating):
    collection_name.insert_one(dict(rating))
    return {"Info": "Successfuly inserted rating!"}

# Update Ratings from DB
@router.put("/update-rating/{subject}/{course}")
async def update_rating(subject: str, course: str, rating: Rating):
    filters = {"subject" : subject, "course": course}
    collection_name.update_one(filters, {"$set": dict(rating)})
    return {"Info": f"Successfuly updated {subject}{course}!"}


# Delete rating
@router.delete("/remove-rating/{subject}/{course}")
async def delete_rating(subject: str, course: str):
    filters = {"subject": subject, "course": course}
    collection_name.delete_one(filters)
    return {"Info": f"Successfully deleted {subject}{course} rating!"}