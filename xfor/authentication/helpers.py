from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.contrib.auth.models import User
from .models import Token
from django.shortcuts import get_object_or_404

def send_activation_email(request,user) -> bool:
    to_email_field = user.get_email_field_name()
    to_email = getattr(user, to_email_field, "") or ""
    if to_email:
        confirm_url = request.get_host() + reverse("confirm",kwargs={"token":user.token})
        subject = f'Добро пожаловать в xFor, {user.username}'
        body = f'\nПомните, что за нарушение правил сообщества можно понести соответствующее наказание\nОтноситесь к другим так как вы бы хотели что бы относились к вам :)\nВаша уникальная ссылка для подтверждения почты:\n{confirm_url}'
        mail = send_mail(subject,body,settings.EMAIL_HOST_USER,[to_email],fail_silently=True)
        return True if mail else False
    else:
        return False

def activate_user(token) -> dict:
    token_obj = get_object_or_404(Token,token=token)
    user = get_object_or_404(User,id=token_obj.user.id)
    if token_obj.is_active:
        user.profile.is_verify = True
        user.profile.save()
        token_obj.is_active = False
        token_obj.save()
        return {'status_code':200,'user':user}
    else:
        return {'status_code':404,'message':'Токен просрочен'}