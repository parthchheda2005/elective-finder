from fastapi import APIRouter, HTTPException, Depends
from models.user import User
from auth.auth import get_password_hash, create_access_token, verify_password
from config.database import users_collection
from datetime import timedelta

router = APIRouter()

# register user
@router.post('/register')
async def regiter_user(user: User):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code = 400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }

    users_collection.insert_one(user_data)
    return {"Info": "User registered successfully"}

# User Login
@router.post('/login')
async def login_user(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if not user or not verify_password(password, user['password']):
        raise HTTPException(status_code=401, detail = "Invalid Credentials")
    
    access_token_expires = timedelta(30)
    access_token = create_access_token(
        data = {"sub": str(user['_id'])},
        expires_delta = access_token_expires
    )

    return {"access_token":access_token, "token_type": 'bearer'}