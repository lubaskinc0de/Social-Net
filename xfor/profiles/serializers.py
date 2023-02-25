from datetime import datetime

from authentication.models import Profile
from django.contrib.auth.models import User

from rest_framework import serializers

from geo_api.serializers import CitySerializer
from main.fields import DateTimeTimezoneField


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "groups"]


class FollowersSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["user", "avatar"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    followers = FollowersSerializer(read_only=True, many=True)
    city = CitySerializer()
    date_joined = serializers.SerializerMethodField(read_only=True)

    def get_date_joined(self, obj: Profile) -> datetime:
        field = DateTimeTimezoneField(read_only=True)
        return field.to_representation(obj.user.date_joined)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "avatar",
            "created_at",
            "bio",
            "followers",
            "birthday",
            "city",
            "date_joined",
        ]
