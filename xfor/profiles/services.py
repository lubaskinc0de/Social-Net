"""Services for the profiles app"""


from authentication.models import Profile


def get_profiles():
    """Get profiles queryset"""

    return Profile.objects.select_related("user").prefetch_related("followers")
