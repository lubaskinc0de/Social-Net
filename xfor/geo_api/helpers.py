from django.utils.http import urlencode
from django.urls import reverse


def build_url(*args, **kwargs) -> str:
    """Similar to django.urls.reverse but allows you to pass GET url parameters"""

    get = kwargs.pop("get", {})
    url = reverse(*args, **kwargs)

    if get:
        url += "?" + urlencode(get)

    return url
