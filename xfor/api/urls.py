from django.urls import path
from .views import PostAddLikeAPIView, CommentAddLikeAPIView, AddLentaCommentAPIView

urlpatterns = [
    path('add-like/',PostAddLikeAPIView.as_view(),name='like'),
    path('add-like-comment/',CommentAddLikeAPIView.as_view(),name='like_comment'),
    path('add-lenta-comment/',AddLentaCommentAPIView.as_view(),name='lenta_comment')
]