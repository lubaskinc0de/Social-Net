from django_filters import rest_framework as filters
from .models import City


class CityFilter(filters.FilterSet):
    """Filter for City model"""

    class Meta:
        model = City
        fields = ["country"]
