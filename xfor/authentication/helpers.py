from datetime import datetime
from djoser.compat import get_user_email
from authentication.email import ActivationEmail
from rest_framework.response import Response
from django.contrib.auth.signals import user_logged_in
from django.utils import timezone
from knox.models import AuthToken
from rest_framework.exceptions import ValidationError
from smtplib import SMTPException
from django.contrib.auth.models import User
from rest_framework.serializers import SerializerMetaclass
from django.utils.translation import gettext as _

def send_activation_email(request, user: User) -> None:
    '''
    Sends an email to activate the account to the user's email
    if the email could not be sent, deletes the user and causes error 500
    '''

    context = {"user": user}
    to = [get_user_email(user)]

    try:
        ActivationEmail(request, context).send(to)
    except SMTPException:
        user.delete()
        raise ValidationError(detail={
            'email': _('Не удалось отправить письмо для активации аккаунта, повторите попытку!')
            }, code=500)

def activate_user(serializer: SerializerMetaclass) -> Response:
    '''
    If serializer is valid, set user.is_active to True

    Return 204 Response
    '''

    serializer.is_valid(raise_exception=True)
    user: User = serializer.user
    user.is_active = True
    user.save()
    return Response(status=204)

def create_authtoken(request, user: User, token_limit_per_user: int, token_ttl: datetime) -> Response:
    '''
    Creates an Auth Token for the specified user, if the token limit is exceeded, raises a 403 HTTP error
    '''

    if token_limit_per_user is not None:
        now = timezone.now()
        token = user.auth_token_set.filter(expiry__gt=now)
        if token.count() >= token_limit_per_user:
            return Response(
                {"error": _("Достигнуто максимальное кол-во токенов на пользователя.")},
                status=403
            )

    instance, token = AuthToken.objects.create(user, token_ttl)
    user_logged_in.send(sender=user.__class__,
                        request=request, user=user)
    return request, token, instance
