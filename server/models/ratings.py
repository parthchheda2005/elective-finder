from pydantic import BaseModel, Field
from typing import Optional
class Rating(BaseModel):
    course: str
    subject: str
    grade: int
    rating: int
    user_id: Optional[str] = Field(None, description="ID of the user who created the rating")