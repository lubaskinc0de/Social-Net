from django.contrib.auth.tokens import PasswordResetTokenGenerator

class AuthenticationToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        email_field = user.get_email_field_name()
        email = getattr(user, email_field, "") or ""
        token = f"{user.pk}{user.password}{timestamp}{user.get_username()}{email}"
        return token

authentication_token = AuthenticationToken()