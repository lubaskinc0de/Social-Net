from rest_framework import serializers
from main.models import Post, Comment


class PostLikeSerializer(serializers.Serializer):
    """
    The serializer that accepts the ID of the post, and checks whether such an ID exists

    Is used for likes
    """

    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())


class CommentLikeSerializer(serializers.Serializer):
    """
    The serializer that accepts the ID of the comment, and checks whether such an ID exists

    Is used for likes
    """

    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())
