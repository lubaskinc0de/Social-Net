from templated_mail.mail import BaseEmailMessage
from .tokens import authentication_token
from djoser.utils import encode_uid
from django.urls import reverse
from django.conf import settings
from django.contrib.auth.models import User

class ActivationEmail(BaseEmailMessage):
    template_name = "authentication/activation.html"

    def get_context_data(self):
        context = super().get_context_data()

        user: User = context.get('user')
        uid = encode_uid(user.id)
        token = authentication_token.make_token(user)

        protocol = context.get('protocol')
        domain = context.get('domain')
        url = reverse("activate",kwargs={"uid": uid, "token": token})

        context['url'] = self.get_full_url(protocol, domain, url)
        context['sitename'] = settings.AUTHENTICATION_SITENAME
        return context
    
    def get_full_url(self, protocol: str, domain: str, url: str) -> str:
        return f'{protocol}://{domain}{url}'