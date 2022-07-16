from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(label='Адрес электронной почты', required=True, write_only=True)

    default_error_messages = {
        "cannot_create_user": "cannot create user, try again"
    }

    class Meta:
        model = User
        fields = ('email', 'username','first_name', 'last_name', 'password', 'is_active')
        extra_kwargs = {
            'password': {'write_only': True, 'validators':[validate_password]},
            'is_active': {'read_only': True}
        }

    def create(self, validated_data):
        try:
            user = self.perform_create(validated_data)
        except:
            self.fail("cannot_create_user")

        return user

    def perform_create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()
        return user