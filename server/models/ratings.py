from pydantic import BaseModel

class Rating(BaseModel):
    course: str
    subject: str
    grade: int
    rating: int