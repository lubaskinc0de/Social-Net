from typing import TypeVar
from rest_framework import serializers
from django.contrib.auth.models import User

class AuthorSerializer(serializers.ModelSerializer):
    '''Serializer of the data required to represent the author'''

    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        field = serializers.ImageField()
        field.bind('avatar', self)
        return field.to_representation(obj.profile.avatar)

    class Meta:
        model = User
        fields = ['first_name','last_name','avatar']

class CurrentAuthorField(serializers.Field):
    '''
    The author field, which requires the User object at the input and returns the author's data for it.
    ignores any input value, focusing only on the default value.
    '''

    T = TypeVar('T')
    
    def get_value(self, dictionary: dict) -> serializers.empty:
        return serializers.empty

    def to_representation(self, value: User) -> dict:
        '''To JSON'''
        return AuthorSerializer(instance=value, context={'request': self.context.get('request')}).data
    
    def to_internal_value(self, data: T) -> T:
        return data