from rest_framework.views import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import RetrieveUpdateDestroyAPIView

class PartialViewSet(ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'options']

    def put(self, request, *args, **kwargs):
        return Response(status=405)

class RetrievePartialDestoyAPIView(RetrieveUpdateDestroyAPIView):
    http_method_names = ['get', 'post', 'patch', 'delete', 'options']
    def put(self, request, *args, **kwargs):
        return Response(status=405)
