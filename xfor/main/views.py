from django.shortcuts import redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .models import Post,Comment,Image
from .forms import PostForm,CommentForm
from django.contrib import messages
from django.urls import reverse_lazy
from .filters import PostFilter
from django.views.generic import CreateView,DetailView,ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from .helpers import get_filters, validate_img
from django.views.generic.edit import FormMixin
from django.db.models import Count, Exists, OuterRef

class HomePage(LoginRequiredMixin,ListView):
    login_url = reverse_lazy('login')
    context_object_name = 'posts'
    allow_empty = True
    template_name = 'main/lenta.html'
    paginate_by = 8

    def get(self, *args, **kwargs):
        if self.request.GET.get('is_popular') and self.request.GET.get('is_interesting'):
            return redirect('home')
        return super().get(*args, **kwargs)

    def get_queryset(self):
        this_user = self.request.user
        posts = Post.objects.annotate(
            viewers_count= Count('viewers', distinct=True),
            liked_count = Count('liked', distinct=True),
            author_in_user_following=Exists(this_user.following.filter(id=OuterRef('author_id'))), # Thx to Nikolay Cherniy
            is_user_liked_post=Exists(this_user.liked.filter(id=OuterRef('id'))))\
            .select_related('author','author__profile')\
            .prefetch_related('images')\
            .order_by('-created_at')
        f = PostFilter(request=self.request,queryset=posts,data=self.request.GET).qs
        return f

    def get_context_data(self, *args , **kwargs):
        context = super().get_context_data(*args,**kwargs)
        f = PostFilter(request=self.request,queryset=self.get_queryset(),data=self.request.GET)
        context['filter'] = f
        context['filter_get'] = get_filters(self.request.GET)
        return context

class AddPost(LoginRequiredMixin,CreateView):
    login_url = reverse_lazy('login')
    template_name = 'main/add_post.html'
    form_class = PostForm
    success_url = reverse_lazy('home')

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        self.object = None # thx Nikolay Cherniy, required to fix a error ''' AddPost object has no attribute 'object' '''
        if form.is_valid() and validate_img(request.FILES.getlist('images')):
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
    
    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.author_id = self.request.user.id
        self.object.profile_id = self.request.user.profile.id
        self.object.save()
        images = self.request.FILES.getlist('images')
        if images:
            for image in images:
                Image.objects.create(
                    photo=image,
                    author_id=self.request.user.id,
                    post_id=self.object.id,
                    )
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request,'Ошибка валидации!')
        return super().form_invalid(form)

class PostDetail(LoginRequiredMixin,FormMixin,DetailView):
    context_object_name = 'post'
    template_name = 'main/post.html'
    login_url = reverse_lazy('login')
    form_class = CommentForm

    def get_queryset(self):
        return Post.objects.annotate(
        liked_cnt=Count('liked', distinct=True),
        viewers_cnt= Count('viewers', distinct=True),
        is_liked=Exists(self.request.user.liked.filter(id=OuterRef('id'))),
        followed=Exists(self.request.user.following.filter(id=OuterRef('author_id'))),
        ).select_related('author','author__profile')
    
    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        if self.object:
            self.object.add_views(self.request.user)
        context = self.get_context_data(object=self.object)
        return self.render_to_response(context)
    
    def get_success_url(self) -> str:
        return reverse_lazy('post',kwargs={'pk':self.object.pk})
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        this_user = self.request.user
        post_comments = Comment.objects.filter(post_id=self.object.pk,is_active=True).annotate(
            is_user_liked_comment=Exists(this_user.liked_comments.filter(id=OuterRef('id')))\
            ,like_cnt=Count('liked')).select_related('author','author__profile')\
            .prefetch_related('images_comment')
        context['comments'] = post_comments
        return context
    
    def post(self, request, *args, **kwargs):
        form = self.get_form()
        self.object = self.get_object()
        if form.is_valid() and validate_img(self.request.FILES.getlist('images')):
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
    
    def form_valid(self, form):
        self.obj = form.save(commit=False)
        self.obj.post_id = self.object.id
        self.obj.author_id = self.request.user.id
        parent_id = self.request.POST.get('parent_id') if self.request.POST.get('parent_id') else None
        self.obj.parent_id = parent_id
        self.obj.save()
        images = self.request.FILES.getlist('images')
        if images:
            for image in images:
                Image.objects.create(
                    photo=image,
                    author_id=self.request.user.id,
                    comment_id=self.obj.id,
                    )
        return super().form_valid(form)
    
    def form_invalid(self, form):
        messages.error(self.request,f'''Ошибка валидации!\n{form.errors.as_text().strip("* body * ")}\n''')
        return super().form_invalid(form)
    

@login_required(login_url='login')
def get_profile(request,pk):
    return HttpResponse(pk)
