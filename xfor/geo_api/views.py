from rest_framework import generics
from rest_framework.response import Response
from .serializers import CitySerializer, CountrySerializer
from .filters import CityFilter, filters
from authentication.permissions import IsAnonymous
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.utils.translation import gettext as _
from .models import City, Country
from django.db import connection

class CountryListAPIView(generics.ListAPIView):
    '''Endpoint for get all countries (for register proccess)'''

    permission_classes = (IsAnonymous, )
    pagination_class = None
    serializer_class = CountrySerializer
    
    def get_queryset(self):
        return Country.objects.exclude(alternate_names__exact='')

    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs) -> Response:
        return super().get(request, *args, **kwargs)

class CityListAPIView(generics.ListAPIView):
    '''Endpoint for get cities for specific country (for register proccess)'''

    permission_classes = (IsAnonymous,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = CityFilter
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        '''Return a city queryset'''

        if connection.vendor == 'postgresql':
            return City.objects.exclude(alternate_names__exact='')\
                .order_by('region__alternate_names', 'alternate_names', 'name')\
                .distinct('alternate_names', 'region__alternate_names')\
                .select_related('country', 'region')
        else:
            # DISTINCT ON working only with postgresql database backend
            return City.objects.exclude(alternate_names__exact='').select_related('country', 'region')

    @method_decorator(cache_page(60*60*2))
    def get(self, request, *args, **kwargs) -> Response:
        '''
        Return response with the cities of a specific country
        a request without specifying the country is prohibited.
        '''
        
        if not request.query_params.get('country'):
            return Response({'country': _('Запрос без указания страны запрещен')}, status=400)
        return super().get(request, *args, **kwargs)
