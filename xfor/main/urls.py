from django.urls import path
from .views import get_profile,HomePage,AddPost,PostDetail
urlpatterns = [
    path('',HomePage.as_view(),name='home'),
    path('profile/<int:pk>',get_profile,name='profile'),
    path('add/',AddPost.as_view(),name='add'),
    path('post/<int:pk>',PostDetail.as_view(),name='post'),
]