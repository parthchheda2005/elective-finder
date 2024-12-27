# JSON TO PYTHON DICT
def individual_serial(rating) -> dict:
    return {
        "id": str(rating["_id"]),
        "course": rating["course"],
        "subject": rating["subject"],
        "grade": rating["grade"],
        "rating": rating["rating"],
    }

def list_serial(ratings) -> list:
    return [individual_serial(rating) for rating in ratings]