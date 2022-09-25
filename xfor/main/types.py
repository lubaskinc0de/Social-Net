from typing import Any, Collection, Protocol
from django.db.models import Model

class AdminModelForm(Protocol):
    '''Typing interface for django.forms.widgets.<Model>Form'''

    instance: Model
    cleaned_data: dict[str, Any]
    _validate_unique: bool
    is_bound: bool
    data: Collection
    _save: list
    files: Collection
    _errors: dict['str', 'str']
    fields: dict['str', Any]
    