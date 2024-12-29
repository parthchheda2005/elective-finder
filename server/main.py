from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import user_routes, rating_routes, course_routes, ai_routes

load_dotenv()
app = FastAPI()

# Enable CORS for your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# ROUTES
app.include_router(user_routes.router) # get all routes from user routes
app.include_router(rating_routes.router) # get all routes form rating routes
app.include_router(course_routes.router) # course routes
app.include_router(ai_routes.router) # ai routes powered by gemini