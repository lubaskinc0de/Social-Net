from django.urls import path
from .views import CityListAPIView, CountryListAPIView

urlpatterns = [
    path('cities/',CityListAPIView.as_view(), name='cities'),
    path('countries/',CountryListAPIView.as_view(), name='countries'),
]