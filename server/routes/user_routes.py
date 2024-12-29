from fastapi import APIRouter, HTTPException, Depends
from models.user import User
from auth.auth import get_password_hash, create_access_token, verify_password
from auth.auth import get_current_user
from config.database import users_collection
from datetime import timedelta

router = APIRouter()

# register user
@router.post('/register')
async def regiter_user(user: User):
    if users_collection.find_one({"email": user.email}): # email already exists and we cant have duplicate emauls
        raise HTTPException(status_code = 400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password) # hash the user password for security
    user_data = {
        "username": user.username,
        "email": user.email,
        "major": user.major,
        "major_code": user.major_code,
        "password": hashed_password
    }
    # turn user data into a dict
    users_collection.insert_one(user_data) # insert user data to db
    return {"Info": "User registered successfully"}

# User Login
@router.post('/login')
async def login_user(username: str, password: str):
    user = users_collection.find_one({"username": username}) # find user by username
    if not user or not verify_password(password, user['password']): # if username dont exist or password is wrong, raise exception
        raise HTTPException(status_code=401, detail = "Invalid Credentials")
    
    access_token_expires = timedelta(30)
    # give access token an exipry
    access_token = create_access_token( # function is in ./auth/auth.py
        data = {"sub": str(user['_id'])}, # create token, with data is is an object where sub (or subject) is user id 
        expires_delta = access_token_expires # set the expires delta in the access token
    )

    return {"access_token":access_token, "token_type": 'bearer'}

@router.get('/get-user-major-code')
async def get_user_major(user: dict = Depends(get_current_user)):
    user_major_code = user.get("major_code")
    return {"Data" : user_major_code}