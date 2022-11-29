from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    CreateModelMixin,
)


class CreateRetrieveUpdateDestroyViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):

    """
    A viewset that provides default `create(), retrieve()`, `update()`,
    `partial_update()` and `destroy()` actions.
    """
