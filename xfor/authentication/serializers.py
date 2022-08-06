from collections import OrderedDict
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile

class UserCreateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']

class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(label='Адрес электронной почты', required=True, write_only=True)
    profile = UserCreateProfileSerializer(required=False)

    default_error_messages = {
        "cannot_create_user": "Не получилось создать пользователя, попробуйте снова."
    }

    class Meta:
        model = User
        fields = ('email', 'username','first_name', 'last_name', 'password', 'is_active', 'profile')
        extra_kwargs = {
            'password': {'write_only': True, 'validators':[validate_password]},
            'is_active': {'read_only': True},
            'username': {'max_length': 50},
            'first_name': {'required': True, 'allow_blank': False, 'max_length': 30},
            'last_name': {'required': True, 'allow_blank': False, 'max_length': 30},
        }

    def create(self, validated_data):
        try:
            user = self.perform_create(validated_data)
        except:
            self.fail("cannot_create_user")

        return user

    def perform_create(self, validated_data: OrderedDict):
        password = validated_data.pop('password')
        user_profile = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.is_active = False
        if user_profile:
            for field in user_profile:
                setattr(user.profile, field, user_profile[field])
        user.save()
        user.profile.save()
        return user