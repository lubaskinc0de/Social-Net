from rest_framework.views import APIView
from rest_framework.views import Response
from rest_framework.serializers import Serializer
from .mixins import LikeMixin

class LikeGenericAPIView(LikeMixin, APIView):
    '''
    Providing an Generic API View to add or remove a request.user from m2m liked model fields.

    serializer_class: a serializer class that is required to accept the id of the object they want to like.

    instance_name: is the name of the field in the serializer that accepts the ID of the 

    lookup_field: the name of the m2m field of the object that stores likes
    '''

    instance_name: str = None
    serializer_class: Serializer = None

    def put(self, request) -> Response:
        '''
        The HTTP Put method, since we update the value of the like field of the object.
        '''
        return self.like(request)


