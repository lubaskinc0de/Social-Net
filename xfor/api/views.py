from main.models import Post,Comment
from .helpers.classes.views import AddLikeAPIView, AddLentaCommentAPIView as LentaCommentAPIView

class PostAddLikeAPIView(AddLikeAPIView):
    model = Post
    instance_name = 'post'

class CommentAddLikeAPIView(AddLikeAPIView):
    model = Comment
    instance_name= 'comment'

class AddLentaCommentAPIView(LentaCommentAPIView):
    comment_model = Comment
    post_model = Post
