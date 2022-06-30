from django.contrib.auth.mixins import AccessMixin
from django.shortcuts import resolve_url,redirect
from urllib.parse import urlparse
from django.core.exceptions import ImproperlyConfigured

class NonLoginRequiredMixin(AccessMixin):
    authenticated_user_redirect_to = None

    def get_login_url(self):
        """
        Override this method to override the login_url attribute.
        """
        login_url = self.authenticated_user_redirect_to
        if not login_url:
            raise ImproperlyConfigured(
                f"{self.__class__.__name__} is missing the authenticated_user_redirect_to attribute. Define "
                f"{self.__class__.__name__}.authenticated_user_redirect_to or override "
                f"{self.__class__.__name__}.get_login_url()."
            )
        return str(login_url)

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)
    
    def handle_no_permission(self):
        path = self.request.build_absolute_uri()
        resolved_login_url = resolve_url(self.get_login_url())
        # If the login url is the same scheme and net location then use the
        # path as the "next" url.
        login_scheme, login_netloc = urlparse(resolved_login_url)[:2]
        current_scheme, current_netloc = urlparse(path)[:2]
        if (not login_scheme or login_scheme == current_scheme) and (
            not login_netloc or login_netloc == current_netloc
        ):
            path = self.request.get_full_path()
        return redirect(resolved_login_url)