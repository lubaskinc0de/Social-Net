from typing import Type

from knox.views import LoginView, LogoutAllView, LogoutView

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from drf_spectacular.utils import extend_schema

from django.contrib.auth.models import User
from knox.models import AuthToken

from .services import activate_user, send_activation_email, create_authtoken
from .permissions import IsAnonymous
from .serializers import UserCreateSerializer, KnoxTokenSerializer, ActivationSerializer
from .tokens import authentication_token


class UserRegisterAPIView(generics.CreateAPIView):
    """Endpoint for user registration (create account)"""

    serializer_class = UserCreateSerializer
    permission_classes = (IsAnonymous,)

    def perform_create(self, serializer: Type[Serializer]) -> None:
        send_activation_email(self.request, serializer.save())


class UserLoginAPIView(LoginView):
    """Endpoint for user log-in (make token)"""

    permission_classes = (IsAnonymous,)

    def get_post_response_data(
        self, request, token: str, instance: AuthToken, user: User
    ) -> dict:
        UserSerializer: Type[Serializer] = self.get_user_serializer_class()

        data = {"expiry": self.format_expiry_datetime(instance.expiry), "token": token}

        if UserSerializer is not None:
            data["user"] = UserSerializer(user, context=self.get_context()).data
        return data

    @extend_schema(request=KnoxTokenSerializer, responses=KnoxTokenSerializer)
    def post(self, request, format=None) -> Response:
        serializer = KnoxTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        token_data = create_authtoken(
            request, user, self.get_token_limit_per_user(), self.get_token_ttl()
        )

        return Response(self.get_post_response_data(*token_data, user))


class UserActivateAPIView(generics.GenericAPIView):
    """Endpoint for user activation (set user field is_active to True)"""

    serializer_class = ActivationSerializer
    token_generator = authentication_token  # used in ActivationSerializer
    permission_classes = (IsAnonymous,)

    def get(self, request, uid: str, token: str) -> Response:
        serializer: Type[Serializer] = self.get_serializer(
            data={"uid": uid, "token": token}
        )
        serializer.is_valid(raise_exception=True)

        user: User = serializer.user
        activate_user(user)

        return Response(status=204)


class UserLogoutAPIView(LogoutView):
    """Endpoint for user log-out (destroy token)"""

    @extend_schema(request=None, responses=None)
    def post(self, request, format=None):
        return super().post(request, format)


class UserLogoutAllAPIView(LogoutAllView):
    """Endpoint for logout all user tokens (destroy all tokens)"""

    @extend_schema(request=None, responses=None)
    def post(self, request, format=None):
        return super().post(request, format)
