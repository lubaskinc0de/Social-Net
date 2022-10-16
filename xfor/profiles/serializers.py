from authentication.models import Profile
from rest_framework import serializers
from django.contrib.auth.models import User
from geo_api.serializers import CitySerializer

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'groups']

class FollowersSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = ['user', 'avatar']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    followers = FollowersSerializer(read_only=True, many=True)
    city = CitySerializer()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar', 'created_at', 'bio', 'followers', 'birthday', 'city']