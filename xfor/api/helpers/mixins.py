from rest_framework.serializers import Serializer
from rest_framework.views import Response

from django.contrib.auth.models import User

from typing import Type


class LikeMixin:
    """
    A mixin that works with the m2m field (lookup_field) of the model, providing the functionality of likes.
    """

    lookup_method: str = None
    instance_name: str = None
    serializer_class: Type[Serializer] = None

    def like(self, data: dict, user: User) -> dict[str, str]:
        """
        Accept data to serializer_class, validate it, takes instance by the instance_name key from the validated data,
        filters the m2m instance lookup_field, if there is already a like, removes it, if not yet, adds it.

        @return dict[str, str] with one key - action that shows what should be done, remove the like - or add.
        """

        serializer: Serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        instance = data.get(self.instance_name)
        instance_like_method = getattr(instance, self.lookup_method, None)

        if not instance_like_method:
            raise AttributeError(
                f"<{instance.__class__.__name__}> object has no attribute <{self.lookup_method}>."
            )

        is_like = instance_like_method(user)

        if is_like:
            return {"action": "add"}
        else:
            # Unused, but <explicit is better than implicit>
            return {"action": "remove"}
