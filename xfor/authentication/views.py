from .helpers.classes.views import RegisterAPIView, ActivateAPIView, AnonymousTokenCreateView
from djoser.views import TokenDestroyView

class UserRegisterAPIView(RegisterAPIView):
    '''Endpoint for user registration'''

class UserActivateAPIView(ActivateAPIView):
    '''Endpoint for user activation'''

class UserLoginAPIView(AnonymousTokenCreateView):
    '''Endpoint for user log-in'''

class UserLogoutAPIView(TokenDestroyView):
    '''Endpoint for user log-out'''

