from rest_framework.serializers import Serializer, SerializerMetaclass
from django.contrib.auth.models import User
from rest_framework.views import Response

class LikeMixin:
    '''
    A mixin that works with the m2m field (lookup_field) of the model, providing the functionality of likes.
    '''

    lookup_field: str
    instance_name: str
    serializer_class: SerializerMetaclass

    def like(self, request) -> Response:
        '''
        Accept request data to serializer_class, validate it, takes instance by the instance_name key from the validated data, 
        filters the m2m instance lookup_field, if there is already a like, removes it, if not yet, adds it.

        Response: action that shows what should be done, remove the like - or add.
        '''
        
        serializer: Serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
    
        instance = data.get(self.instance_name)
        user: User = request.user
        instance_liked_field = getattr(instance, self.lookup_field, None)

        if not instance_liked_field:
            raise AttributeError(f'<{instance.__class__.__name__}> object has no attribute <{self.lookup_field}>.')

        is_like = instance_liked_field.filter(id=user.id).exists()

        if is_like:
            instance_liked_field.remove(user)
            return Response(data={'action': 'remove'}, status=200)
        else:
            # Unused, but <explicit is better than implicit>
            instance_liked_field.add(user)
            return Response(data={'action': 'add'}, status=200)