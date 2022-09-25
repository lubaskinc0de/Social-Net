from typing import Collection, Iterable
from rest_framework import serializers
from .models import Image, Post, Comment
from .fields import CurrentAuthorField
from .helpers.helpers import run_images_validators
from .mixins import ErrorMessagesSerializersMixin
from django.utils.translation import gettext as _
from mptt.models import MPTTModel

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['photo']

class PostSerializer(ErrorMessagesSerializersMixin, serializers.ModelSerializer):
    viewers_count = serializers.IntegerField(read_only=True)
    liked_count = serializers.IntegerField(read_only=True)
    author_in_user_following = serializers.BooleanField(read_only=True)
    is_user_liked_post = serializers.BooleanField(read_only=True)
    author = CurrentAuthorField(default=serializers.CurrentUserDefault())
    images = ImageSerializer(many=True, read_only=True)

    default_error_messages = {
        'empty_post': _('Пустой пост'),
    }

    def validate(self, attrs: dict) -> None:
        request = self.context.get('request')
        images, title, content = request.FILES.getlist('images'), attrs.get('title'), attrs.get('content')

        if not any((images, title, content)):
            self.fail('empty_post')

        run_images_validators(images)

        return super().validate(attrs)
            
    def images_create(self, images: Iterable, post_id: int, is_update: bool = False) -> None:
        '''
        Adds images to the post
        '''

        if is_update and any(images):
            Image.objects.filter(post_id=post_id).delete()

        author = self.context.get('request').user

        for image in images:
            Image.objects.create(post_id=post_id, photo=image, author=author)

    def create(self, validated_data: dict) -> Post:
        instance = super().create(validated_data)
        images = self.context.get('request').FILES.getlist('images')
        self.images_create(images, instance.id)
        return instance
    
    def update(self, instance: Post, validated_data: dict) -> Post:
        instance = super().update(instance, validated_data)
        images = self.context.get('request').FILES.getlist('images')
        self.images_create(images, instance.id, is_update=True)
        return instance

    class Meta:
        model = Post
        fields = [
            'id','title','content','created_at','updated_at',
            'author', 'viewers_count', 'liked_count',
            'author_in_user_following', 'is_user_liked_post', 'images',
            ]

class CommentSerializer(ErrorMessagesSerializersMixin,serializers.ModelSerializer):
    is_user_liked_comment = serializers.BooleanField(read_only=True)
    like_cnt = serializers.IntegerField(read_only=True)
    images_comment = ImageSerializer(many=True, read_only=True)
    author = CurrentAuthorField(default=serializers.CurrentUserDefault())
    children = serializers.SerializerMethodField(read_only=True)

    default_error_messages = {
        'empty_comment': _('Пустой комментарий'),
        'parent_comment_references_to_other_post': {
            'parent': _('Родительский комментарий оставлен под другим постом.')
        }
    }

    def get_grandchildren(self, childrens: Collection[MPTTModel]) -> list:
        '''
        This method is designed to form a flat list of node descendants up to the second level
        thereby greatly facilitating the work of the frontend.

        Because it does not have to go through a complex tree structure of descendants
        provided that we give only 3 nodes to each page and also output only descendants of level 2 inclusive.

        This does not cause a strong overhead,
        but this has not been tested on a large number of nodes and levels.

        Alternative solution to achieve a tree structure is
        to remove this method and slightly edit get_children():

        def get_children(self, obj):
            if not self.context.get('not_children'):
                childrens = obj.get_children()[:2]
                return self.__class__(childrens, many=True, context=self.context).data
        
        Provided that the QuerySet in the view was cached in advance via mptt.utils.get_cached_trees()
        this will not cause any queries to the database.
        
        The entire overhead can occur only because of copies of the list.
        '''

        grandchildren = []

        for children in childrens:
            grandson = children.get_children().first()
            if grandson:
                grandchildren.extend([children, grandson])
            else:
                grandchildren.extend([children])

        return grandchildren[:2]

    def get_children(self, obj: Comment) -> dict:
        '''
        if the comment is root comment and children are not disabled,
        get the children up to the second level (see get_grandchildren).
        '''

        if not (obj.level == 0 and not self.context.get('not_children')):
            return

        childrens = obj.get_children()[:2]
        descendants = self.get_grandchildren(childrens)
        return self.__class__(descendants, many=True, context=self.context).data

    def validate(self, attrs: dict) -> None:
        request = self.context.get('request')
        images, body = request.FILES.getlist('images'), attrs.get('body')
        parent, post_id = attrs.get('parent'), attrs.get('post').id

        if not any((images, body)):
            self.fail('empty_comment')

        if parent:
            if not Comment.objects.filter(id=parent.id, post_id=post_id, is_active=True).exists():
                self.fail('parent_comment_references_to_other_post')

        run_images_validators(images)

        return super().validate(attrs)
            
    def images_create(self, images: Iterable, comment_id: int) -> None:
        '''
        Adds images to the comment
        '''

        author = self.context.get('request').user
        for image in images:
            Image.objects.create(comment_id=comment_id, photo=image, author=author)

    def create(self, validated_data: dict) -> Comment:
        instance = super().create(validated_data)
        images = self.context.get('request').FILES.getlist('images')
        self.images_create(images, instance.id)
        return instance

    class Meta:
        model = Comment
        fields = [
            'id','post','created_at', 'updated_at', 'parent',
            'body', 'is_user_liked_comment', 'children',
            'like_cnt', 'images_comment', 'author',
        ]
        extra_kwargs = {
            'body': {'required': False}
        }

class CommentUpdateSerializer(CommentSerializer):
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    def images_create(self, images: Iterable, comment_id: int, is_update: bool = False) -> None:
        '''
        Adds images to the post
        '''

        if is_update and any(images):
            Image.objects.filter(comment_id=comment_id).delete()
            
        author = self.context.get('request').user

        for image in images:
            Image.objects.create(comment_id=comment_id, photo=image, author=author)

    def update(self, instance: Comment, validated_data: dict) -> Comment:
        instance = super().update(instance, validated_data)
        images = self.context.get('request').FILES.getlist('images')
        self.images_create(images, instance.id, is_update=True)
        return instance
