from django.urls import reverse_lazy
from authentication.serializers import UserCreateSerializer
from rest_framework import generics
from authentication.permissions import IsAnonymous
from djoser.serializers import ActivationSerializer
from authentication.tokens import authentication_token
from authentication.helpers.functions.helpers import send_activation_email, activate_user
from knox.views import LoginView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from django.contrib.auth.signals import user_logged_in
from rest_framework.response import Response
from django.utils import timezone
from knox.models import AuthToken
from rest_framework import status

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

class AnonymousTokenCreateView(LoginView):
    permission_classes = (IsAnonymous,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
    
        token_limit_per_user = self.get_token_limit_per_user()
        if token_limit_per_user is not None:
            now = timezone.now()
            token = user.auth_token_set.filter(expiry__gt=now)
            if token.count() >= token_limit_per_user:
                return Response(
                    {"error": "Maximum amount of tokens allowed per user exceeded."},
                    status=status.HTTP_403_FORBIDDEN
                )
        token_ttl = self.get_token_ttl()
        instance, token = AuthToken.objects.create(user, token_ttl)
        user_logged_in.send(sender=user.__class__,
                            request=request, user=user)
        data = self.get_post_response_data(user, token, instance)
        return Response(data)

    def get_post_response_data(self, user, token, instance):
        UserSerializer = self.get_user_serializer_class()

        data = {
            'expiry': self.format_expiry_datetime(instance.expiry),
            'token': token
        }
        if UserSerializer is not None:
            data["user"] = UserSerializer(
                user,
                context=self.get_context()
            ).data
        return data