from collections import OrderedDict
from datetime import date
from typing import Union

from django.contrib.auth.models import User
from .models import Profile

from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError

from main.mixins import ErrorMessagesSerializersMixin
from .services import register_user
from .helpers import validate_age, is_string_contains_digits

from rest_framework import serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer

from djoser.serializers import ActivationSerializer as DjoserActivationSerializer

from django.utils.translation import gettext as _

from drf_extra_fields.fields import HybridImageField


class UserCreateProfileSerializer(
    ErrorMessagesSerializersMixin, serializers.ModelSerializer
):
    avatar = HybridImageField(required=False, allow_null=True)

    default_error_messages = {
        "invalid_image": serializers.ImageField.default_error_messages.get(
            "invalid_image",
            _("Файл, который вы загрузили, поврежден или не является изображением"),
        ),
        "age_less_than_fourteen": _("Вам меньше четырнадцати лет."),
        "age_more_than_onehundred_forty": _(
            "Вы не можете указать возраст больше 140 лет."
        ),
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["avatar"].error_messages[
            "invalid"
        ] = self.default_error_messages.get("invalid_image")

    def validate_birthday(self, birthday: date) -> Union[date, None]:
        """Validate age greater than 14 and less than 140"""

        if not validate_age(birthday, 14):
            self.fail("age_less_than_fourteen")

        if validate_age(birthday, 140):
            self.fail("age_more_than_onehundred_forty")

        return birthday

    class Meta:
        model = Profile
        fields = ["avatar", "birthday", "city"]
        extra_kwargs = {
            "birthday": {"required": True, "allow_null": False},
            "city": {"required": True, "allow_null": False},
        }


class UserCreateSerializer(ErrorMessagesSerializersMixin, serializers.ModelSerializer):
    email = serializers.EmailField(
        label="Адрес электронной почты", required=True, write_only=True
    )
    profile = UserCreateProfileSerializer(required=True)

    default_error_messages = {
        "cannot_create_user": _(
            "Не получилось создать пользователя, попробуйте снова."
        ),
        "username_contains_only_digits": {
            "username": _("Логин не может состоять только из цифр.")
        },
        "first_name_contains_digits": {
            "first_name": _("В имени не могут быть цифры."),
        },
        "last_name_contains_digits": {
            "last_name": _("В фамилии не могут быть цифры."),
        },
    }

    class Meta:
        model = User
        fields = (
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "is_active",
            "profile",
        )
        extra_kwargs = {
            "password": {"write_only": True, "validators": [validate_password]},
            "is_active": {"read_only": True},
            "username": {"max_length": 50, "min_length": 4},
            "first_name": {"required": True, "allow_blank": False, "max_length": 30},
            "last_name": {"required": True, "allow_blank": False, "max_length": 30},
        }

    def validate_names(self, username: str, first_name: str, last_name: str) -> None:
        if username.isdigit():
            self.fail("username_contains_only_digits")
        if is_string_contains_digits(first_name):
            self.fail("first_name_contains_digits")
        if is_string_contains_digits(last_name):
            self.fail("last_name_contains_digits")

    def validate(self, attrs: dict):
        username, first_name, last_name = (
            attrs.get("username"),
            attrs.get("first_name"),
            attrs.get("last_name"),
        )
        self.validate_names(username, first_name, last_name)
        return super().validate(attrs)

    def create(self, validated_data: OrderedDict) -> Union[User, None]:
        try:
            user = self.perform_create(validated_data)
            return user
        except IntegrityError:
            self.fail("cannot_create_user")

    def perform_create(self, validated_data: OrderedDict) -> User:
        password = validated_data.pop("password")
        profile_data: dict = validated_data.pop("profile", None)

        return register_user(validated_data, password, profile_data)


class KnoxTokenSerializer(AuthTokenSerializer):
    expiry = serializers.DateTimeField(read_only=True, label=_("Expiry"))


class LoginPayloadSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(read_only=True)
    profile_id = serializers.PrimaryKeyRelatedField(source="profile", read_only=True)

    def get_avatar(self, user: User):
        field = serializers.ImageField()
        field.bind("avatar", self)
        return field.to_representation(user.profile.avatar)

    class Meta:
        model = User
        fields = ["profile_id", "first_name", "last_name", "avatar"]
        extra_kwargs = {
            "first_name": {"read_only": True},
            "last_name": {"read_only": True},
        }


class ActivationSerializer(DjoserActivationSerializer):
    default_error_messages = {
        "stale_token": _("Токен просрочен."),
        "invalid_token": _("Токен неправильный или поврежден."),
        "invalid_uid": _("Неправильный или поврежденный UID."),
    }
