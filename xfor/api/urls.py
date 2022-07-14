from django.urls import path
from .views import add_lenta_comment, PostAddLikeAPIView, CommentAddLikeAPIView

urlpatterns = [
    path('add-like/',PostAddLikeAPIView.as_view(),name='like'),
    path('add-like-comment/',CommentAddLikeAPIView.as_view(),name='like_comment'),
    path('add-lenta-comment/',add_lenta_comment,name='lenta_comment')
]