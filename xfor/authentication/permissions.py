from rest_framework.permissions import BasePermission


class IsAnonymous(BasePermission):
    """Allows the request only to unauthorized users"""

    def has_permission(self, request, view):
        return not request.user.is_authenticated
