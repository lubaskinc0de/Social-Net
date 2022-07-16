from django.contrib import admin
from .models import Profile,Contact
from django.utils.safestring import mark_safe

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id','user','created_at','get_status','get_avatar']
    list_display_links = ['id','user']
    search_fields = ['user__username','id']
    list_select_related = ['user']
    fields = ['id','user','bio','avatar','get_avatar','created_at']
    readonly_fields = ['id','get_avatar','created_at']

    def get_avatar(self,obj):
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" height="40" width="40">')
        else:
            return '-'

    get_avatar.short_description = 'Аватар'

    def get_status(self,obj):
        return obj.bio if obj.bio else '-'
    get_status.short_description = 'Статус'

class ContactAdmin(admin.ModelAdmin):
    list_display = ['id','user_from_get_fio','user_to_get_fio','created_at']
    list_display_links = ['id','user_from_get_fio','user_to_get_fio']
    search_fields = ['id','user_from__username','user_to__username']
    empty_value_display = '-'
    ordering = ['-created_at']
    fields = ['id','user_from','user_to','created_at']
    readonly_fields = ['id','created_at']
    list_select_related = ['user_from','user_to']

    def user_from_get_fio(self,obj):
        return obj.user_from.first_name + ' ' + obj.user_from.last_name
    user_from_get_fio.short_description = 'От'
    
    def user_to_get_fio(self,obj):
        return obj.user_to.first_name + ' ' + obj.user_to.last_name
    user_to_get_fio.short_description = 'На'
    

admin.site.register(Profile,ProfileAdmin)
admin.site.register(Contact,ContactAdmin)
