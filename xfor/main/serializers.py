from rest_framework import serializers
from .models import Image, Post, Comment
from .fields import CurrentPostAuthorField, CurrentPostDefault
from .other_helpers.functions.helpers import run_images_validators

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['photo']

class PostSerializer(serializers.ModelSerializer):
    viewers_count = serializers.IntegerField(read_only=True)
    liked_count = serializers.IntegerField(read_only=True)
    author_in_user_following = serializers.BooleanField(read_only=True)
    is_user_liked_post = serializers.BooleanField(read_only=True)
    author = CurrentPostAuthorField(default=serializers.CurrentUserDefault())
    images = ImageSerializer(many=True, read_only=True)

    def validate(self, attrs):
        request = self.context.get('request')
        images, title, content = request.FILES.getlist('images'), attrs.get('title'), attrs.get('content')

        if not any((images, title, content)):
            raise serializers.ValidationError(detail={'error': 'Пустой пост'}, code=400)

        run_images_validators(images)

        return super().validate(attrs)
            
    def images_create(self, images, post_id: int, is_update: bool=False) -> None:
        if is_update and images != []:
            Image.objects.filter(post_id=post_id).delete()
        author = self.context.get('request').user
        for image in images:
            Image.objects.create(post_id=post_id, photo=image, author=author)

    def create(self, validated_data):
        instance = super().create(validated_data)
        self.images_create(self.context.get('request').FILES.getlist('images'), instance.id)
        return instance
    
    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        self.images_create(self.context.get('request').FILES.getlist('images'), instance.id, is_update=True)
        return instance

    class Meta:
        model = Post
        fields = [
            'id','title','content','created_at','updated_at',
            'author', 'viewers_count', 'liked_count',
            'author_in_user_following', 'is_user_liked_post', 'images',
            ]

class CommentSerializer(serializers.ModelSerializer):
    post_id = serializers.HiddenField(default=CurrentPostDefault())
    is_user_liked_comment = serializers.BooleanField(read_only=True)
    like_cnt = serializers.IntegerField(read_only=True)
    images_comment = ImageSerializer(many=True, read_only=True)
    author = CurrentPostAuthorField(default=serializers.CurrentUserDefault())
    children = serializers.SerializerMethodField(read_only=True)

    def _get_childrens_with_childrens(self, childrens):
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
        childrens_with_childrens = []
        for children in childrens:
            children_children = children.get_children()[:1]
            if children_children:
                childrens_with_childrens.extend([children, children_children[0]])
            else:
                childrens_with_childrens.extend([children])
        return childrens_with_childrens[:2]

    def get_children(self, obj):
        if obj.level == 0 and not self.context.get('not_children'):
            childrens = obj.get_children()[:2]
            return self.__class__(self._get_childrens_with_childrens(childrens), many=True, context=self.context).data

    def validate(self, attrs):
        request = self.context.get('request')
        images, body, parent, post_id = request.FILES.getlist('images'), attrs.get('body'), attrs.get('parent'), attrs.get('post_id')

        if not any((images, body)):
            raise serializers.ValidationError(detail={'error': 'Пустой комментарий'}, code=400)

        if parent:
            if not Comment.objects.filter(id=parent.id, post_id=post_id, is_active=True).exists():
                raise serializers.ValidationError(detail={'error': 'Указанный родительский комментарий привязан к другому посту.'},code=400)

        run_images_validators(images)

        return super().validate(attrs)
            
    def images_create(self, images, comment_id: int) -> None:
        author = self.context.get('request').user
        for image in images:
            Image.objects.create(comment_id=comment_id, photo=image, author=author)

    def create(self, validated_data):
        instance = super().create(validated_data)
        self.images_create(self.context.get('request').FILES.getlist('images'), instance.id)
        return instance

    class Meta:
        model = Comment
        fields = [
            'id','post_id','created_at', 'updated_at', 'parent',
            'body', 'is_user_liked_comment', 'children',
            'like_cnt', 'images_comment', 'author',
        ]
        extra_kwargs = {
            'body': {'required': False}
        }

class CommentUpdateSerializer(CommentSerializer):
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    def images_create(self, images, comment_id: int, is_update:bool = False) -> None:
        if is_update and images != []:
            Image.objects.filter(comment_id=comment_id).delete()
        author = self.context.get('request').user
        for image in images:
            Image.objects.create(comment_id=comment_id, photo=image, author=author)

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        self.images_create(self.context.get('request').FILES.getlist('images'), instance.id, is_update=True)
        return instance
