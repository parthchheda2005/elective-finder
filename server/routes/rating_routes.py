from fastapi import APIRouter, Depends, HTTPException
from models.ratings import Rating
from config.database import ratings_collection
from schema.schemas import list_serial, individual_serial
from auth.auth import get_current_user

router = APIRouter()

# Get rating by course
@router.get("/ratings/{subject}/{course}")
async def get_rating_by_course(subject: str, course: str, user: dict = Depends(get_current_user)): # depends on current user
    rating = ratings_collection.find_one({"subject": subject, "course": course, "user_id" : str(user["_id"])})
    # get rating by subject, course, and user
    if rating:
        serialized_rating = individual_serial(rating) # make the rating an actual usable python dict
        serialized_rating['found'] = True # set found true, helps with the fronted (which i gotta clean up)
        return serialized_rating
    else:
        return {"found": False, "message": "No rating found for the specified subject and course."}



# Add ratings to DB (post method)
@router.post("/create-rating")
async def create_ratings(rating: Rating, user: dict = Depends(get_current_user)):
    rating_data = dict(rating)
    rating_data['user_id'] = str(user["_id"])
    ratings_collection.insert_one(rating_data)
    return {"Info": "Successfuly inserted rating!"}

# Update Ratings from DB
@router.put("/update-rating/{subject}/{course}")
async def update_rating(subject: str, course: str, rating: Rating, user: dict = Depends(get_current_user)):
    filters = {"subject" : subject, "course": course, "user_id": str(user["_id"])} 
    rating_data = dict(rating)
    rating_data['user_id'] = str(user["_id"])
    result =  ratings_collection.update_one(filters, {"$set": dict(rating_data)})
    # get rating by subject, course, and user and set it to the new rating
    if result.matched_count == 0: # if we did not find a rating, raise an exception
        raise HTTPException(status_code=404, detail="Rating not found")

    return {"Info": f"Successfuly updated {subject}{course}!"}


# Delete rating
@router.delete("/remove-rating/{subject}/{course}")
async def delete_rating(subject: str, course: str, user: dict = Depends(get_current_user)):
    filters = {"subject": subject, "course": course, "user_id": str(user["_id"])}
    result = ratings_collection.delete_one(filters)
    # get rating by subject, course, and user and delete it
    if result.deleted_count == 0: # if we did not find a rating, raise an exception
        raise HTTPException(status_code=404, detail="Rating not found")

    return {"Info": f"Successfully deleted {subject}{course} rating!"}