from main.models import Post,Comment
from .helpers.classes.views.api_view import AddLikeAPIView, AddLentaCommentAPIView as LentaCommentAPIView

class PostAddLikeAPIView(AddLikeAPIView):
    model = Post
    instance_name = 'post'

class CommentAddLikeAPIView(AddLikeAPIView):
    model = Comment
    instance_name= 'comment'

class AddLentaCommentAPIView(LentaCommentAPIView):
    comment_model = Comment
    post_model = Post

# TODO: make AddLentaCommentAPIView
# @ajax_required
# @csrf_protect
# def add_lenta_comment(request):
#     response = {}
#     if request.POST.get('post_id') and request.POST.get('body') and request.user.is_authenticated:
#         post = get_object_or_404(Post,pk=request.POST.get('post_id'))
#         try:
#             Comment.objects.create(post_id=post.id,author_id=request.user.id,body=str(request.POST.get('body')))
#         except:
#             response['error'] = 'Неправильный формат комментария'
#         response['status'] = 'success'
#     else:
#         response['error'] = 'Неправильный формат данных'
#     return JsonResponse(response)
