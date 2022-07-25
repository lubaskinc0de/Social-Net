from django_filters import rest_framework as filters
from .models import Post
from django.forms import CheckboxInput,Select
from django.db.models import Count
from django.db.models import Case, Value, When

class PostFilter(filters.FilterSet):
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

    def ordering_filter(self,queryset,name,value):
        if self.data.get('is_interesting'):
            followed = self.request.user.following.all()
            return queryset.annotate(flag=Case(When(author__in=followed, then=Value('1')),default=Value('0'))).order_by('-flag',value)

        if self.data.get('is_popular'):
            return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt',value)

        return queryset.order_by(value)

    def filter_interesting(self,queryset,name,value):
        if value:
            followed = self.request.user.following.all()
            if self.data.get('ordering'):
                return queryset.annotate(flag=Case(When(author__in=followed, then=Value('1')),default=Value('0'))).order_by('-flag',self.data.get('ordering'))

            return queryset.annotate(flag=Case(When(author__in=followed, then=Value('1')),default=Value('0'),)).order_by('-flag','-created_at') # thx to Dan Tyan (this is fix bug with paginate_by)
        return queryset
    
    def filter_popular(self,queryset,name,value):
        if value:
            if self.data.get('ordering'):
                return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt',self.data.get('ordering'))
    
            return queryset.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt','-created_at') # сортируем по количевству лайков ( Count() вычисляет количевство ) 

        return queryset