from templated_mail.mail import BaseEmailMessage
from .tokens import authentication_token
from djoser.utils import encode_uid
from django.urls import reverse
from django.conf import settings

class ActivationEmail(BaseEmailMessage):
    template_name = "authentication/activation.html"

    def get_context_data(self):
        # ActivationEmail can be deleted

        context = super().get_context_data()

        user = context.get("user")
        uid = encode_uid(user.pk)
        token = authentication_token.make_token(user)
        protocol = context.get('protocol')
        domain = context.get('domain')
        context['url'] = f'{protocol}://{domain}{reverse("activate",kwargs={"uid": uid, "token": token})}'
        context['sitename'] = settings.AUTHENTICATION_SITENAME
        return context