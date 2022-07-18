from .helpers.classes.views import RegisterAPIView, ActivateAPIView, AnonymousTokenCreateView
from djoser.views import TokenDestroyView

class UserRegisterAPIView(RegisterAPIView):
    '''Endpoint for user registration (create account)'''

class UserActivateAPIView(ActivateAPIView):
    '''Endpoint for user activation (set is_active to True)'''

class UserLoginAPIView(AnonymousTokenCreateView):
    '''Endpoint for user log-in (make token)'''

class UserLogoutAPIView(TokenDestroyView):
    '''Endpoint for user log-out (destroy token)'''

