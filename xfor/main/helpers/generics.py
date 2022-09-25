from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateDestroyAPIView

class PartialViewSet(ModelViewSet):
    '''
    View Set which excludes the put method from allowed HTTP methods
    '''

    http_method_names = ['get', 'post', 'patch', 'delete', 'options']

    def put(self, request, *args, **kwargs) -> None:
        self.http_method_not_allowed()

class RetrievePartialDestroyAPIView(RetrieveUpdateDestroyAPIView):
    '''
    APIView which excludes the put method from allowed HTTP methods
    '''
    
    http_method_names = ['get', 'post', 'patch', 'delete', 'options']

    def put(self, request, *args, **kwargs) -> None:
        self.http_method_not_allowed()