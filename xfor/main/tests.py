from rest_framework.test import APITestCase
from knox.models import AuthToken
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Post
from django.db.models import Count, OuterRef, Exists
from geo_api.helpers import build_url

from .serializers import PostSerializer

class PostsTestCase(APITestCase):
    '''Posts test'''

    def setUp(self) -> None:
        self.email = 'poststestcase@gmail.com'
        self.password = 'asd123321'

        self.user = User.objects.create_user('PostsTestCase', self.email, self.password)
        self.token: str = AuthToken.objects.create(self.user)[-1]

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    
    def get_posts(self):
        '''Create posts and return ready queryset'''

        post_objects = (
            Post(
                profile=self.user.profile,
                title='Post ' + str(i),
                content='lorem ipsum',
                author=self.user,
            ) for i in range(10)
        )

        Post.objects.bulk_create(post_objects)

        posts = self.get_posts_queryset(self.user)
        return posts

    def get_posts_queryset(self, user: User):
        this_user = user
        
        return Post.objects.annotate(
            viewers_count= Count('viewers', distinct=True),
            liked_count = Count('liked', distinct=True),
            author_in_user_following=Exists(this_user.profile.following.filter(id=OuterRef('author__profile__id'))), # Thx to Nikolay Cherniy
            is_user_liked_post=Exists(this_user.liked.filter(id=OuterRef('id'))))\
            .select_related('author','author__profile')\
            .prefetch_related('images')\
            .order_by('-created_at')
    
    def test_get_posts_not_authorized(self):
        '''Test getting posts not authorized'''

        url = reverse('feed')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)
    
    def test_get_posts(self):
        '''Test getting posts'''

        url = reverse('feed')
        posts = self.get_posts()[:3]

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)

    def test_get_posts_by_page(self):
        '''Test getting posts'''

        url = build_url('feed', get={
            'page': 2,
        })

        posts = self.get_posts()[3:6]
        
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)
