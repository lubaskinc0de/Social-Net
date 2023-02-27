"""Services for the profiles app"""


from authentication.models import Profile
from django.db.models import Count


def get_profiles():
    """Get profiles queryset"""

    return Profile.objects.annotate(
        followers_count=Count("followers", distinct=True),
    ).select_related("user", "city", "city__country").prefetch_related("user__groups").order_by("-created_at")
