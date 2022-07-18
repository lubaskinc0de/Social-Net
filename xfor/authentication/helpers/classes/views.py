from django.urls import reverse_lazy
from authentication.serializers import UserCreateSerializer
from rest_framework import generics
from authentication.permissions import IsAnonymous
from djoser.serializers import ActivationSerializer
from authentication.tokens import authentication_token
from authentication.helpers.functions.helpers import send_activation_email, activate_user
from djoser.views import TokenCreateView

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = (IsAnonymous,)
    authenticated_user_redirect_to = reverse_lazy('home')

    def perform_create(self, serializer):
        send_activation_email(self.request, serializer.save())

class ActivateAPIView(generics.GenericAPIView):
    serializer_class = ActivationSerializer
    token_generator = authentication_token
    permission_classes = (IsAnonymous,)
    authenticated_user_redirect_to = reverse_lazy('home')

    def get(self, request, uid, token):
        return activate_user(self.get_serializer(data={'uid': uid, 'token': token}))

class AnonymousTokenCreateView(TokenCreateView):
    permission_classes = (IsAnonymous,)