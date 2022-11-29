from datetime import date
from dateutil.relativedelta import relativedelta
import re


def validate_age(birthday: date, age: int) -> bool:
    """
    Accepts the birthday, checks that the age is greater or equal than the one transmitted by age
    depending on the success of the check, it returns True or False.
    """

    today = date.today()

    if relativedelta(today, birthday).years < age:
        return False

    return True


def is_string_contains_digits(string: str):
    """Returns True if string contains digits"""

    return re.search(r"\d", string)
