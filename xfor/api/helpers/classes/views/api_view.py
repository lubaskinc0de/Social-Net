from pyexpat import model
from rest_framework.views import APIView
from rest_framework.views import Response
from rest_framework.views import APIView
from api.helpers.functions.helpers import validate_like_request_data, validate_comment_request_data
from django.shortcuts import get_object_or_404

class AddLikeAPIView(APIView):
    '''API View for likes'''
    model = None
    instance_name = None

    def put(self, request):
        model = get_object_or_404(self.model, pk=validate_like_request_data(request, self.instance_name))
        is_like = model.liked.filter(id=request.user.id).exists()
        if is_like:
            model.liked.remove(request.user)
            return Response(data={'is_like': 'remove'}, status=200)
        else:
            model.liked.add(request.user)
            return Response(data={'is_like': 'add'}, status=200)

class AddLentaCommentAPIView(APIView):
    '''API View for inline comment add'''
    comment_model = None
    post_model = None

    def post(self, request):
        post_id, body = validate_comment_request_data(request)
        post = get_object_or_404(self.post_model, pk=post_id)
        try:
            self.comment_model.objects.create(post_id=post.id, author_id=request.user.id, body=body)
        except:
            return Response(status=400)
        return Response(data={'status': 'success'}, status=200)


