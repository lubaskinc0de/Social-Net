from typing import Collection, TypeVar

from django.contrib.auth.models import User
from django.db.models import Count, Exists, OuterRef

from .models import Post, Comment, Image

T = TypeVar("T")


def get_posts(user: User):
    """Get posts queryset"""

    posts = (
        Post.objects.annotate(
            viewers_count=Count("viewers", distinct=True),
            liked_count=Count("liked", distinct=True),
            author_in_user_following=Exists(
                user.profile.following.filter(id=OuterRef("author__profile__id"))
            ),  # Thx to Nikolay Cherniy
            is_user_liked_post=Exists(user.liked.filter(id=OuterRef("id"))),
        )
        .select_related("author__profile")
        .prefetch_related("images")
        .order_by("-created_at")
    )

    return posts


def get_comments_queryset(queryset: T, user: User) -> T:
    """Annotate and JOIN the comments queryset"""

    return (
        queryset.annotate(
            is_user_liked_comment=Exists(user.liked_comments.filter(id=OuterRef("id"))),
            like_cnt=Count("liked", distinct=True),
        )
        .select_related("author", "author__profile")
        .prefetch_related("images_comment")
    )


def get_comments(user: User):
    """Get all comments"""

    comments = get_comments_queryset(Comment.objects.all(), user)
    return comments


def get_post_comments(user: User, post_id: int):
    """Get comments of post"""

    comments = get_comments_queryset(Comment.objects.filter(post_id=post_id), user)
    return comments


def get_comment_descendants(comment: Comment, user: User):
    """Get descendants of comment"""

    descendants = get_comments_queryset(comment.get_descendants(), user)
    return descendants


def create_images(
    images: Collection, author: User, is_update: bool = False, **filters: dict
) -> None:
    """Helper-function for adding images to instance (must be obtained by filtering by **filters)"""

    if is_update and any(images):
        Image.objects.filter(**filters).delete()

    images = [Image(photo=image, author=author, **filters) for image in images]

    Image.objects.bulk_create(images)


def create_post_images(
    images: Collection, post_id: int, author: User, is_update: bool = False
) -> None:
    """
    Adds images to the post
    """

    create_images(images, author, is_update, post_id=post_id)


def create_comment_images(
    images: Collection, comment_id: int, author: User, is_update: bool = False
) -> None:
    """
    Adds images to the comment
    """

    create_images(images, author, is_update, comment_id=comment_id)
