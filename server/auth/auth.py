from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from config.database import users_collection
import os
from bson import ObjectId

password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

SECRET_KEY = os.environ['JWT_SECRET']
ALGORITHM = os.environ['ALGORITHM']

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# get hashed password
def get_password_hash(password: str):
    return password_context.hash(password)

# verify hashed password
def verify_password(plain_password: str, hashed_password: str):
    return password_context.verify(plain_password, hashed_password)

# create an access token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy() # take data 
    expire = datetime.utcnow() + expires_delta # create expiry time
    to_encode['exp'] = expire # add expiry to the data object
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # encode it

# get current user but ig u can tell from the function name
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # decode token
        user_id = payload.get("sub") # for my reference: sub stands for subject. tokens carry a paylaod, where the subject is the user id.
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"_id": ObjectId(user_id)}) # query to get user from the db
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


