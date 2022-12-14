from typing import TypeVar
from rest_framework import serializers
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema_field


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer of the data required to represent the author"""

    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        field = serializers.ImageField()
        field.bind("avatar", self)
        return field.to_representation(obj.profile.avatar)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "avatar"]


@extend_schema_field(
    {
        "type": "string",
        "format": "string",
        "read_only": True,
        "example": {
            "first_name": "string",
            "last_name": "string",
            "avatar": "string",
        },
    }
)
class CurrentAuthorField(serializers.Field):
    """
    The author field, which requires the User object at the input and returns the author's data for it.
    ignores any input value, focusing only on the default value.
    """

    T = TypeVar("T")

    def get_value(self, dictionary: dict) -> serializers.empty:
        return serializers.empty

    def to_representation(self, value: User) -> dict:
        """To JSON"""

        return AuthorSerializer(
            instance=value, context={"request": self.context.get("request")}
        ).data

    def to_internal_value(self, data: T) -> T:
        """From JSON"""

        return data


class DateTimeTimezoneField(serializers.DateTimeField):
    """DateTime field with current user timezone"""

    def default_timezone(self):
        request = self.context.get("request")

        if request:
            return request.timezone
        return super().default_timezone()


@extend_schema_field(
    {
        "type": "string",
        "format": "string",
    }
)
class PostCategoryField(serializers.PrimaryKeyRelatedField):
    """Read-write field for PostCategory, provides __str__ of PostCategory object as output, accepts category pk as input"""

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        """To JSON"""

        return str(value)
