from mptt.utils import get_cached_trees
from rest_framework.settings import api_settings
from .permissions import IsAuthorOrReadOnly

class CacheTreeQuerysetMixin:
    _cached_queryset = None
    depth = None

    def _get_cached_queryset(self, queryset):

        if self.depth:
            queryset = queryset.filter(level__lte=self.depth)

        if not self._cached_queryset:
            self._cached_queryset = get_cached_trees(queryset)

        return self._cached_queryset


class IsAuthorPermissionsMixin:
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES + [IsAuthorOrReadOnly]
