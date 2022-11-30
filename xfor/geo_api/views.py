from rest_framework import generics
from rest_framework.response import Response

from .serializers import CitySerializer, CountrySerializer
from .filters import CityFilter, filters

from authentication.permissions import IsAnonymous

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.utils.translation import gettext as _

from .services import get_countries, get_cities


class CountryListAPIView(generics.ListAPIView):
    """Endpoint for get all countries (for register proccess)"""

    permission_classes = (IsAnonymous,)
    pagination_class = None
    serializer_class = CountrySerializer
    queryset = get_countries()

    @method_decorator(cache_page(60 * 60 * 2))
    def get(self, request, *args, **kwargs) -> Response:
        return super().get(request, *args, **kwargs)


class CityListAPIView(generics.ListAPIView):
    """Endpoint for get cities for specific country (for register proccess)"""

    permission_classes = (IsAnonymous,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = CityFilter
    serializer_class = CitySerializer
    pagination_class = None
    queryset = get_cities()

    @method_decorator(cache_page(60 * 60 * 2))
    def get(self, request, *args, **kwargs) -> Response:
        """
        Return response with the cities of a specific country
        a request without specifying the country is prohibited.
        """

        if not request.query_params.get("country"):
            return Response(
                {"country": _("Запрос без указания страны запрещен")}, status=400
            )
        return super().get(request, *args, **kwargs)
