"""Services for the profiles app"""


from authentication.models import Profile


def get_profiles():
    """Get profiles queryset"""

    return Profile.objects.select_related("user", "city", "city__country").prefetch_related("followers", "user__groups")
