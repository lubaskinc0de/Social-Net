from django.urls import path
from .views import (
    UserActivateAPIView,
    UserRegisterAPIView,
    UserLoginAPIView,
    UserLogoutAPIView,
    UserLogoutAllAPIView,
    CheckTokenAPIView,
)

urlpatterns = [
    path("", UserRegisterAPIView.as_view(), name="reg"),
    path(
        "confirm/<str:uid>/<str:token>/", UserActivateAPIView.as_view(), name="activate"
    ),
    path("login/", UserLoginAPIView.as_view(), name="login"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout"),
    path("logoutall/", UserLogoutAllAPIView.as_view(), name="logout_all"),
    path("check-token/", CheckTokenAPIView.as_view(), name="check_token"),
]
