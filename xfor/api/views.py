from django.http import JsonResponse
from main.helpers import ajax_required
from django.shortcuts import get_object_or_404
from main.models import Post,Comment
from django.views.decorators.csrf import csrf_protect
from rest_framework.views import APIView
from rest_framework.views import Response
from .helpers import validate_like_request_data

class PostAddLikeAPIView(APIView):
    def put(self, request):
        post = get_object_or_404(Post, pk=validate_like_request_data(request, 'post'))
        is_like = post.liked.filter(id=request.user.id).exists()
        if is_like:
            post.liked.remove(request.user)
            return Response(data={'is_like': 'remove'}, status=200)
        else:
            post.liked.add(request.user)
            return Response(data={'is_like': 'add'}, status=200)

class CommentAddLikeAPIView(APIView):
    def put(self, request):
        comment = get_object_or_404(Comment, pk=validate_like_request_data(request, 'comment'))
        is_like = comment.liked.filter(id=request.user.id).exists()
        if is_like:
            comment.liked.remove(request.user)
            return Response(data={'is_like': 'remove'}, status=200)
        else:
            comment.liked.add(request.user)
            return Response(data={'is_like': 'add'}, status=200)


# TODO: make AddLentaCommentAPIView
@ajax_required
@csrf_protect
def add_lenta_comment(request):
    response = {}
    if request.POST.get('post_id') and request.POST.get('body') and request.user.is_authenticated:
        post = get_object_or_404(Post,pk=request.POST.get('post_id'))
        try:
            Comment.objects.create(post_id=post.id,author_id=request.user.id,body=str(request.POST.get('body')))
        except:
            response['error'] = 'Неправильный формат комментария'
        response['status'] = 'success'
    else:
        response['error'] = 'Неправильный формат данных'
    return JsonResponse(response)
