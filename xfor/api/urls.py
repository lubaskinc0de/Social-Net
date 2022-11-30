from django.urls import path
from .views import PostAddLikeAPIView, CommentAddLikeAPIView

urlpatterns = [
    path("add-like/", PostAddLikeAPIView.as_view(), name="like"),
    path("add-like-comment/", CommentAddLikeAPIView.as_view(), name="like_comment"),
]
