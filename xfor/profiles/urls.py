from django.urls import path
from .views import ProfileAPIView, ProfileDetailAPIView, ProfileDetailsAPIView

urlpatterns = [
    path('', ProfileAPIView.as_view(), name='profiles'),
    path('<int:pk>/', ProfileDetailAPIView.as_view(), name='profile'),
    path('me/', ProfileDetailsAPIView.as_view(), name='profile_details')
]