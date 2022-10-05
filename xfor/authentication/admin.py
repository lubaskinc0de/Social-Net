from datetime import date
from typing import Union
from django.contrib import admin
from .models import Profile, Contact
from django.utils.safestring import mark_safe, SafeString
from django.contrib.auth.models import User
from knox.admin import AuthTokenAdmin
from .models import CustomAuthToken
from knox.models import AuthToken
from dateutil.relativedelta import relativedelta

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id','user','created_at','get_status', 'get_years_old','get_avatar', 'get_city']
    list_display_links = ['id','user']
    search_fields = ['user__username','id', 'city__alternate_names']
    list_select_related = ['user', 'city']
    fields = ['id','user','bio','avatar','get_avatar', 'birthday', 'city','created_at']
    readonly_fields = ['id','get_avatar','created_at']
    autocomplete_fields = ['user', 'city']

    def get_avatar(self, obj: Profile) -> Union[SafeString, str]:
        if obj.avatar:
            return mark_safe(f'<img src="{obj.avatar.url}" height="40" width="40">')
        else:
            return '-'

    get_avatar.short_description = 'Аватар'

    def get_status(self, obj: Profile) -> str:
        return obj.bio if obj.bio else '-'

    get_status.short_description = 'Статус'

    def get_city(self, obj: Profile) -> str:
        return obj.city.alternate_names or obj.city.name if obj.city else '-'
    
    get_city.short_description = 'Город'

    def get_years_old(self, obj: Profile) -> Union[int, str]:
        if not obj.birthday:
            return '-'
        
        today = date.today()
        years_old = relativedelta(today, obj.birthday).years

        return years_old
    
    get_years_old.short_description = 'Полных лет'

class ContactAdmin(admin.ModelAdmin):
    list_display = ['id','user_from_get_full_name','user_to_get_full_name','created_at']
    list_display_links = ['id','user_from_get_full_name','user_to_get_full_name']
    search_fields = ['id','user_from__username','user_to__username']
    empty_value_display = '-'
    ordering = ['-created_at']
    fields = ['id','user_from','user_to','created_at']
    readonly_fields = ['id','created_at']
    list_select_related = ['user_from','user_to']
    autocomplete_fields = ['user_from','user_to']

    def get_full_name(self, user: User) -> str:
        return f'{user.first_name} {user.last_name}'

    def user_from_get_full_name(self, obj: Contact) -> str:
        return self.get_full_name(obj.user_from.user)
    user_from_get_full_name.short_description = 'От'
    
    def user_to_get_full_name(self, obj: Contact):
        return self.get_full_name(obj.user_to.user)
    user_to_get_full_name.short_description = 'На'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('user_from__user', 'user_to__user')

class TokenAdmin(AuthTokenAdmin):
    '''CustomAuthToken admin'''
    pass

to_register = [(Profile, ProfileAdmin), (Contact, ContactAdmin), (CustomAuthToken, TokenAdmin)]
to_unregister = [AuthToken]

for model in to_unregister:
    admin.site.unregister(model)

for model, model_admin in to_register:
    admin.site.register(model, model_admin)
