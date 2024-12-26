from pydantic import BaseModel, EmailStr, Field

class RateSchema(BaseModel):
    id: int = Field(default = None)
    course: str
    subject: str
    grade: int
    rating: int