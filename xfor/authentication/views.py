from .helpers.classes.views import AnonymousTokenCreateView
from djoser.views import TokenDestroyView
from authentication.serializers import UserCreateSerializer
from django.contrib.auth.models import User
from authentication.helpers.functions.helpers import send_activation_email, activate_user
from rest_framework import generics
from authentication.permissions import IsAnonymous
from django.urls import reverse_lazy
from djoser.serializers import ActivationSerializer
from authentication.tokens import authentication_token

class UserRegisterAPIView(generics.CreateAPIView):
    '''Endpoint for user registration (create account)'''
    serializer_class = UserCreateSerializer
    permission_classes = (IsAnonymous,)
    queryset = User.objects.all().prefetch_related('profile')
    authenticated_user_redirect_to = reverse_lazy('home')

    def perform_create(self, serializer):
        send_activation_email(self.request, serializer.save())

class UserActivateAPIView(generics.GenericAPIView):
    '''Endpoint for user activation (set is_active to True)'''
    serializer_class = ActivationSerializer
    token_generator = authentication_token
    permission_classes = (IsAnonymous,)
    authenticated_user_redirect_to = reverse_lazy('home')

    def get(self, request, uid, token):
        return activate_user(self.get_serializer(data={'uid': uid, 'token': token}))

class UserLoginAPIView(AnonymousTokenCreateView):
    '''Endpoint for user log-in (make token)'''

class UserLogoutAPIView(TokenDestroyView):
    '''Endpoint for user log-out (destroy token)'''

