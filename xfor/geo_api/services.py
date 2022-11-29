from .models import City, Country
from django.db import connection


def get_countries():
    """Get countries queryset"""

    return Country.objects.exclude(alternate_names__exact="")


def get_cities():
    """Get cities queryset"""

    if connection.vendor == "postgresql":
        return (
            City.objects.exclude(alternate_names__exact="")
            .order_by("region__alternate_names", "alternate_names", "name")
            .distinct("alternate_names", "region__alternate_names")
            .select_related("country", "region")
        )
    else:
        # DISTINCT ON working only with postgresql database backend
        return City.objects.exclude(alternate_names__exact="").select_related(
            "country", "region"
        )
