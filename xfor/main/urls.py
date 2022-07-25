from django.urls import path
from .views import get_profile, PostViewSet, CommentAPIView, CommentDescendantsAPIView, CommentDetailAPIView

urlpatterns = [
    # Posts

    path('',PostViewSet.as_view(
        {
        'get': 'list', 
        'post': 'create',
        }
    ), name='home'),

    path('<int:pk>/', PostViewSet.as_view(
        {
        'get': 'retrieve', 
        'put': 'update',
        'delete': 'destroy',
        'patch': 'partial_update',
        }
    ), name='post'),

    # Comments

    path('comments/<int:pk>/',CommentAPIView.as_view(),name='post_comments'),
    path('comments/descendants/<int:pk>/', CommentDescendantsAPIView.as_view(), name='comment_descendants'),
    path('comment/<int:pk>/', CommentDetailAPIView.as_view(), name='comment'),
    
    # Profile
    path('profile/<int:pk>/',get_profile,name='profile'),
]