from djoser.compat import get_user_email
from authentication.email import ActivationEmail
from rest_framework.response import Response

def send_activation_email(request, user):
    context = {"user": user}
    to = [get_user_email(user)]
    ActivationEmail(request, context).send(to)

def activate_user(serializer):
    serializer.is_valid(raise_exception=True)
    user = serializer.user
    user.is_active = True
    user.save()
    return Response(status=204)
