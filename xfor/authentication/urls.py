from django.urls import path
from .views import ActivateUser,UserLogin,UserRegister

urlpatterns = [
    path('login/',UserLogin.as_view(),name='login'),
    path('confirm/<str:token>',ActivateUser.as_view(),name='confirm'),
    path('',UserRegister.as_view(),name='reg')
]