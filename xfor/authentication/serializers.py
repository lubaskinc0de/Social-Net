from collections import OrderedDict
import re
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile
from django.db.utils import IntegrityError
from drf_extra_fields.fields import HybridImageField
from django.utils.translation import gettext as _
from datetime import date
from dateutil.relativedelta import relativedelta
from main.mixins import ErrorMessagesSerializersMixin
from typing import Union

class UserCreateProfileSerializer(ErrorMessagesSerializersMixin, serializers.ModelSerializer):
    avatar = HybridImageField(required=False, allow_null=True)

    default_error_messages = {

        'invalid_image': serializers.ImageField.default_error_messages\
            .get('invalid_image', _('Файл, который вы загрузили, поврежден или не является изображением')),

        'age_less_than_fourteen': _('Вам меньше четырнадцати лет.'),
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['avatar'].error_messages['invalid'] = self.default_error_messages.get('invalid_image')

    def validate_birthday(self, value: date) -> Union[date, None]:
        today = date.today()
        
        if relativedelta(today, value).years < 14:
            self.fail('age_less_than_fourteen')

        return value

    class Meta:
        model = Profile
        fields = ['avatar', 'birthday', 'city']
        extra_kwargs = {
            'birthday': {'required': True, 'allow_null': False},
            'city': {'required': True, 'allow_null': False},
        }

class UserCreateSerializer(ErrorMessagesSerializersMixin, serializers.ModelSerializer):
    email = serializers.EmailField(label='Адрес электронной почты', required=True, write_only=True)
    profile = UserCreateProfileSerializer(required=True)

    default_error_messages = {
        'cannot_create_user': _('Не получилось создать пользователя, попробуйте снова.'),
        
        'username_contains_only_digits': {
            'username': _('Логин не может состоять только из цифр.')
        },
        'first_name_contains_digits': {
            'first_name': _('В имени не могут быть цифры.'),
        },
        'last_name_contains_digits': {
            'last_name': _('В фамилии не могут быть цифры.'),
        },
    }

    class Meta:
        model = User
        fields = ('email', 'username','first_name', 'last_name', 'password', 'is_active', 'profile')
        extra_kwargs = {
            'password': {'write_only': True, 'validators':[validate_password]},
            'is_active': {'read_only': True},
            'username': {'max_length': 50, 'min_length': 4},
            'first_name': {'required': True, 'allow_blank': False, 'max_length': 30},
            'last_name': {'required': True, 'allow_blank': False, 'max_length': 30},
        }
    
    def validate_names(self, username: str, first_name: str, last_name: str) -> None:
        if username.isdigit():
            self.fail('username_contains_only_digits')
        if re.search(r'\d', first_name):
            self.fail('first_name_contains_digits')
        if re.search(r'\d', last_name):
            self.fail('last_name_contains_digits')

    def validate(self, attrs):
        username, first_name, last_name = attrs.get('username'), attrs.get('first_name'), attrs.get('last_name')
        self.validate_names(username, first_name, last_name)
        return super().validate(attrs)

    def create(self, validated_data: OrderedDict) -> Union[User, None]:
        try:
            user = self.perform_create(validated_data)
            return user
        except IntegrityError:
            self.fail('cannot_create_user')
    
    def setup_user_profile(self, attrs: dict, profile: Profile) -> Profile:
        for key in attrs:
            if not attrs.get(key) is None:
                setattr(profile, key, attrs.get(key))
        return profile

    def perform_create(self, validated_data: OrderedDict) -> User:
        password = validated_data.pop('password')
        profile_attrs: dict = validated_data.pop('profile', None)

        user: User = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.is_active = False

        profile = self.setup_user_profile(profile_attrs, user.profile)

        user.save()
        profile.save()
        return user
