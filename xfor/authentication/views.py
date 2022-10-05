from djoser.serializers import ActivationSerializer
from knox.views import LoginView, LogoutAllView, LogoutView
from rest_framework import generics
from rest_framework.response import Response

from .helpers import (activate_user, send_activation_email, create_authtoken)
from .permissions import IsAnonymous
from .serializers import UserCreateSerializer, KnoxTokenSerializer                   
from .tokens import authentication_token
from drf_spectacular.utils import extend_schema

class UserRegisterAPIView(generics.CreateAPIView):
    '''Endpoint for user registration (create account)'''
    serializer_class = UserCreateSerializer
    permission_classes = (IsAnonymous,)

    def perform_create(self, serializer) -> None:
        send_activation_email(self.request, serializer.save())

class UserLoginAPIView(LoginView):
    '''Endpoint for user log-in (make token)'''
    
    permission_classes = (IsAnonymous,)

    @extend_schema(request=KnoxTokenSerializer, responses=KnoxTokenSerializer)
    def post(self, request, format=None) -> Response:
        serializer = KnoxTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token_data = create_authtoken(request, user, self.get_token_limit_per_user(), self.get_token_ttl())
        return Response(self.get_post_response_data(*token_data))

class UserActivateAPIView(generics.GenericAPIView):
    '''Endpoint for user activation (set user field is_active to True)'''
    serializer_class = ActivationSerializer
    token_generator = authentication_token # used in ActivationSerializer
    permission_classes = (IsAnonymous,)

    def get(self, request, uid: str, token: str) -> Response:
        return activate_user(self.get_serializer(data={'uid': uid, 'token': token}))

class UserLogoutAPIView(LogoutView):
    '''Endpoint for user log-out (destroy token)'''

    @extend_schema(request=None, responses=None)
    def post(self, request, format=None):
        return super().post(request, format)

class UserLogoutAllAPIView(LogoutAllView):
    '''Endpoint for logout all user tokens (destroy all tokens)'''
    
    @extend_schema(request=None, responses=None)
    def post(self, request, format=None):
        return super().post(request, format)
