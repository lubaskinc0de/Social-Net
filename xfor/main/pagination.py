from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class PageParamAPIPagination(PageNumberPagination):
    page_size_query_param = 'size'
    max_page_size = None

    def get_paginated_response(self, data: list[dict]) -> Response:
        return Response({
            'next': self.get_next_link(),
            'results': data,
        })