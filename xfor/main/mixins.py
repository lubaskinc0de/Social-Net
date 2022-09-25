from mptt.utils import get_cached_trees
from rest_framework.settings import api_settings
from .permissions import IsAuthorOrReadOnly
from rest_framework import serializers

class CacheTreeQuerysetMixin:
    '''
    A mixin that caches the list of records obtained via mptt.get_cached_trees
    into the _cached_queryset attribute.

    Otherwise two identical queries will be executed

    Supported depth attribute which specifies the length of mptt descendants
    '''
    
    _cached_queryset: list = None
    depth: int = None

    def _get_cached_queryset(self, queryset):

        if self.depth:
            queryset = queryset.filter(level__lte=self.depth)

        if not self._cached_queryset:
            self._cached_queryset = get_cached_trees(queryset)

        return self._cached_queryset


class IsAuthorPermissionsMixin:
    '''
    A mixin that, in addition to the default permissions, adds the IsAuthorOrReadOnly permission
    '''

    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES + [IsAuthorOrReadOnly]


class ErrorMessagesSerializersMixin:
    '''
    A mixin for serializers that makes it easy to raise exceptions from default_error_messages.
    
    Made for the reason that the default self.fail() of serializers does
    not support errors in the form of dictionaries
    '''

    def fail(self, key: str) -> None:
        '''
        A helper method that simply raises a validation error.
        '''
        
        try:
            msg = self.error_messages[key]
        except KeyError:
            class_name = self.__class__.__name__
            error_message = '\
                ValidationError raised by `{class_name}`,\
                but error key `{key}` does not exist in the `error_messages` dictionary.'
            msg = error_message.format(class_name=class_name, key=key)
            raise KeyError(msg)

        raise serializers.ValidationError(msg, code=key)
