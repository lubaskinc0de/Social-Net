from django.urls import path
from .views import add_lenta_comment, add_like,add_like_comment

urlpatterns = [
    path('add-like/',add_like,name='like'),
    path('add-like-comment/',add_like_comment,name='like_comment'),
    path('add-lenta-comment/',add_lenta_comment,name='lenta_comment')
]