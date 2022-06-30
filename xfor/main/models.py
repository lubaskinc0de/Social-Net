from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User
from .helpers import path_and_rename
from authentication.models import Profile
from mptt.models import MPTTModel, TreeForeignKey

class Image(models.Model):
    post = models.ForeignKey('Post',related_name='images',related_query_name='images',on_delete=models.CASCADE,verbose_name='Пост',null=True,blank=True)
    comment = models.ForeignKey('Comment',related_name='images_comment',related_query_name='images_comment',on_delete=models.CASCADE,verbose_name='Комментарий',null=True,blank=True)
    photo = models.ImageField(verbose_name='Фото',upload_to=path_and_rename)
    author = models.ForeignKey(User,verbose_name='Автор',on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Дата создания')

    def __str__(self):
        return self.photo.name.split('/')[-1]

    class Meta:
        verbose_name = 'Фотографии'
        verbose_name_plural = 'Фото'
        ordering = ('created_at',)

class Post(models.Model):
    profile = models.ForeignKey(Profile,null=True,on_delete=models.CASCADE,related_name='posts_profile',verbose_name='Профиль')
    title = models.CharField(max_length=150,verbose_name='Название')
    content = models.TextField(verbose_name='Контент',blank=True)
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Обновлено')
    viewers = models.ManyToManyField(User,related_name='posts',related_query_name='posts',verbose_name='Просмотры',blank=True)
    author = models.ForeignKey(User,verbose_name='Автор',on_delete=models.CASCADE)
    liked = models.ManyToManyField(User,verbose_name='Лайкнувшие',related_name='liked',related_query_name='liked',blank=True)

    def __str__(self):
        return self.title or self.content[:10] or self.author.username

    def get_absolute_url(self):
        return reverse('post',kwargs={'pk':self.pk})

    def add_views(self,user):
        is_view = user in self.viewers.all()
        if not is_view:
            self.viewers.add(user)

    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        ordering = ('-created_at',)

class Comment(MPTTModel):
    post = models.ForeignKey(Post,related_name='comments',related_query_name='comments',on_delete=models.CASCADE,verbose_name='Пост')
    author = models.ForeignKey(User,related_name='comments_author',related_query_name='comments_author',on_delete=models.CASCADE,verbose_name='Автор')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True,verbose_name='Дата редактирования')
    is_active = models.BooleanField(default=True,verbose_name='Активный?')
    body = models.TextField(verbose_name='Текст')
    liked = models.ManyToManyField(User,verbose_name='Лайкнувшие',related_name='liked_comments',related_query_name='liked_comments',blank=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='replies',verbose_name='Родительский комментарий')

    def __str__(self) -> str:
        return f'Комментарий {self.pk}'
    
    def get_reply(self):
        return self.get_descendants().select_related('parent','post','author')

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'
        ordering = ('-created_at',)

    class MPTTMeta:
        order_insertion_by = ['-created_at']
