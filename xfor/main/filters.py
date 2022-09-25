from django_filters import rest_framework as filters
from .models import Post
from django.forms import CheckboxInput,Select
from django.db.models import Count
from django.db.models import Exists, OuterRef

class PostFilter(filters.FilterSet):
    '''Post filter'''

    CHOICES = (
        ('created_at','Сначала старые'),
        ('-created_at','Сначала новые'),
    )

    is_interesting = filters.BooleanFilter(
        method='filter_interesting',
        distinct=True,
        widget=CheckboxInput(attrs={'class':'filter','id':'radio1','checked':False}),
        label='Интересные',
    )
    
    is_popular = filters.BooleanFilter(
        method='filter_popular',
        distinct=True,
        widget=CheckboxInput(attrs={'class':'filter','id':'radio2','checked':False}),
        label='Популярные',
    )

    ordering = filters.ChoiceFilter(
        choices=CHOICES,
        method='ordering_filter',
        widget=Select(attrs={'class':'filter','id':'ordering'}),
        label='По дате',
    )

    class Meta:
        model = Post
        fields = []

    def ordering_filter(self, queryset, name: str, value: str):
        '''Order by created_at '''

        if self.data.get('is_interesting'):
            following = self.request.user.profile.following
            return queryset.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
                .order_by('-flag', value)

        if self.data.get('is_popular'):
            return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt', value)

        return queryset.order_by(value)

    def filter_interesting(self, queryset, name: str, value: bool):
        '''Filter by user.profile.following posts'''

        if not value:
            return queryset
        
        following = self.request.user.profile.following
        ordering = self.data.get('ordering')
        
        if ordering:
            return queryset.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
                .order_by('-flag', ordering)

        return queryset.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
            .order_by('-flag', '-created_at') # thx to Dan Tyan (this is fix bug with paginate_by)
    
    def filter_popular(self, queryset, name: str, value: bool):
        '''Order by likes count'''

        if not value:
            return queryset
        
        ordering = self.data.get('ordering')

        if ordering:
            return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt', ordering)
    
        return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt','-created_at')