from typing import Any, Collection, Protocol
from django.db.models import Model

class AdminModelForm(Protocol):
    '''Typing interface for django.forms.widgets.<Model>Form'''

    instance: Model
    cleaned_data: dict[str, Any]
    is_bound: bool
    data: Collection
    files: Collection
    fields: dict[str, Any]
    