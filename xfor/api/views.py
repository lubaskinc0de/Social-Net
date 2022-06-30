from django.http import JsonResponse
from main.helpers import ajax_required
from django.shortcuts import get_object_or_404
from main.models import Post,Comment
from django.views.decorators.csrf import csrf_protect

@ajax_required
@csrf_protect
def add_like(request):
    response = {}
    if request.POST.get('post_id') and request.user.is_authenticated:
        post = get_object_or_404(Post,pk=request.POST.get('post_id'))
        is_like = post.liked.filter(id=request.user.id).exists()
        if is_like:
            post.liked.remove(request.user)
            response['is_like'] = 'remove'
        else:
            post.liked.add(request.user)
            response['is_like'] = 'add'
    else:
        response['error'] = 'invalid data'
    return JsonResponse(response)

@ajax_required
@csrf_protect
def add_like_comment(request):
    response = {}
    if request.POST.get('comment_id') and request.user.is_authenticated:
        comment = get_object_or_404(Comment,pk=request.POST.get('comment_id'))
        is_like = comment.liked.filter(id=request.user.id).exists()
        if is_like:
            comment.liked.remove(request.user)
            response['is_like'] = 'remove'
        else:
            comment.liked.add(request.user)
            response['is_like'] = 'add'
    else:
        response['error'] = 'invalid data'
    return JsonResponse(response)

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
