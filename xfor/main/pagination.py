from rest_framework.pagination import PageNumberPagination

class PageParamAPIPagination(PageNumberPagination):
    page_size_query_param = 'size'
    max_page_size = None