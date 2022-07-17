from .helpers.classes.views import RegisterAPIView, ActivateAPIView, AnonymousTokenCreateView
from knox.views import LogoutView

class UserRegisterAPIView(RegisterAPIView):
    '''Endpoint for user registration'''

class UserActivateAPIView(ActivateAPIView):
    '''Endpoint for user activation'''

class UserLoginAPIView(AnonymousTokenCreateView):
    '''Endpoint for user log-in'''

class UserLogoutAPIView(LogoutView):
    '''Endpoint for user log-out'''

