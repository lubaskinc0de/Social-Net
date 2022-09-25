from .helpers.generics import LikeGenericAPIView
from .serializers import PostLikeSerializer, CommentLikeSerializer

class PostAddLikeAPIView(LikeGenericAPIView):
    '''Like the post'''

    instance_name = 'post'
    serializer_class = PostLikeSerializer
    lookup_field = 'liked'

class CommentAddLikeAPIView(LikeGenericAPIView):
    '''Like the comment'''
    
    instance_name= 'comment'
    serializer_class = CommentLikeSerializer
    lookup_field = 'liked'
