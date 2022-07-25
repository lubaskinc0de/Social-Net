from rest_framework import serializers
from django.contrib.auth.models import User

class PostAuthorSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        field = serializers.ImageField()
        field.bind('avatar', self)
        return field.to_representation(obj.profile.avatar)

    class Meta:
        model = User
        fields = ['first_name','last_name','avatar']

class CurrentPostAuthorField(serializers.Field):
    
    def get_value(self, dictionary):
        return serializers.empty

    def to_representation(self, value):
        '''To JSON'''
        return PostAuthorSerializer(instance=value, context={'request': self.context.get('request')}).data
    
    def to_internal_value(self, data):
        return data

class CurrentPostDefault(serializers.CurrentUserDefault):
    def __call__(self, serializer_field):
        return serializer_field.context['post_id']