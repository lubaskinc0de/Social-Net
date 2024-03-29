from django.urls import path

from .views import PostViewSet, CommentViewSet

urlpatterns = [
    # Posts
    path(
        "",
        PostViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
        name="feed",
    ),
    path(
        "<int:pk>/",
        PostViewSet.as_view(
            {
                "get": "retrieve",
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
        name="post",
    ),
    path(
        "<int:pk>/comments/",
        PostViewSet.as_view(
            {
                "get": "get_comments",
            }
        ),
        name="post_comments",
    ),
    path(
        "like/",
        PostViewSet.as_view(
            {
                "put": "like_post"
            }
        ),
        name="like",
    ),
    path(
        "categories/",
        PostViewSet.as_view(
            {
                "get": "get_categories",
            }
        ),
        name="post_categories",
    ),
    # Comments
    path(
        "comments/",
        CommentViewSet.as_view(
            {
                "post": "create",
            }
        ),
    ),
    path(
        "comment/<int:pk>/",
        CommentViewSet.as_view(
            {
                "get": "retrieve",
                "delete": "destroy",
                "patch": "partial_update",
            }
        ),
    ),
    path(
        "comment/<int:pk>/descendants/",
        CommentViewSet.as_view(
            {
                "get": "get_descendants",
            }
        ),
    ),
    path(
        "comment/like/",
        CommentViewSet.as_view(
            {
                "put": "like_comment"
            }
        ),
        name="like_comment",
    ),
]
