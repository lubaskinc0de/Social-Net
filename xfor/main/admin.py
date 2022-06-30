from django.contrib import admin
from .models import Post,Image,Comment
from django.utils.safestring import mark_safe

class PostAdmin(admin.ModelAdmin):
    list_display = ['id','__str__','author','liked_count','viewers_count','created_at','updated_at','get_post_photo']
    list_display_links = ['id','__str__']
    list_select_related = ['author','profile']
    search_fields = ['id','title','author__username']
    empty_value_display = '-'
    autocomplete_fields = ['author','profile']
    fields = ['id','profile','title','content','viewers_count','liked_count','author','created_at','updated_at','get_post_photo']
    readonly_fields = ['id','created_at','updated_at','viewers_count','liked_count','get_post_photo']
    

    def liked_count(self,obj):
        return obj.liked.count()
    liked_count.short_description = 'Кол/во лайков'
    
    def viewers_count(self,obj):
        return obj.viewers.count()
    viewers_count.short_description = 'Кол/во просмотров'

    def get_post_photo(self,obj):
        if obj.images.exists():
            return mark_safe(f'<img src="{obj.images.first().photo.url}" height="40" width="40">')
        else:
            return '-'
    get_post_photo.short_description = 'Миниатюра'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('liked','viewers','images')

class CommentAdmin(admin.ModelAdmin):
    list_display = ['id','post'[:50],'author','liked_count','created_at','updated_at','is_reply','is_active']
    list_display_links = ['id','post']
    list_filter = ['is_active']
    search_fields = ['author__username','post__title','id']
    empty_value_display = '-'
    fields = ['id','post','author','liked_count','liked','parent','body','created_at','updated_at','is_active']
    readonly_fields = ['id','liked_count','created_at','updated_at']

    list_select_related = ['parent','author','post']

    def is_reply(self,obj) -> bool:
        if not obj.parent:
            return 'Нет'
        else:
            return 'Да'
    is_reply.short_description = 'Ответ?'

    def liked_count(self,obj):
        return obj.liked.count()
    liked_count.short_description = 'Кол/во лайков'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('liked')


class ImageAdmin(admin.ModelAdmin):
    list_display = ['id','post','comment','author','get_image','created_at']
    list_display_links = ['id','post','comment','get_image']
    list_select_related = ['post','comment','author']
    search_fields = ['id','author__username']
    empty_value_display = '-'
    fields = ['id','post','comment','photo','get_image','author','created_at']
    readonly_fields = ['id','created_at','get_image']
    ordering = ['-created_at']

    def get_image(self,obj):
        return mark_safe(f'<img src="{obj.photo.url}" height="40" width="40">')
    get_image.short_description = 'Миниатюра'


# Register

admin.site.register(Post,PostAdmin)
admin.site.register(Image,ImageAdmin)
admin.site.register(Comment,CommentAdmin)
