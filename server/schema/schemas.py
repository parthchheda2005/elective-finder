# JSON TO PYTHON DICT
def individual_serial(rating) -> dict: # turn json to python dict
    return {
        "id": str(rating["_id"]),
        "course": rating["course"],
        "subject": rating["subject"],
        "grade": rating["grade"],
        "rating": rating["rating"],
        "user_id": rating['user_id']
    }

def list_serial(ratings) -> list: # do this to a list of items
    return [individual_serial(rating) for rating in ratings]