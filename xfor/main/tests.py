from rest_framework.test import APITestCase
from knox.models import AuthToken
from django.contrib.auth.models import User
from django.urls import reverse
from .models import Post
from django.db.models import Count, OuterRef, Exists
from geo_api.helpers import build_url
from .serializers import PostSerializer
from datetime import timedelta
from django.utils import timezone

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

        posts = Post.objects.bulk_create(post_objects)

        for i, post in enumerate(posts):
            # Because we cannot set the created_at field immediately when creating an object
            post.created_at = timezone.now() + timedelta(minutes=i)
            post.save()

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
    
    def test_filter_posts_by_interesting_and_popular_will_cause_a_error(self):
        '''A test filter of posts by interesting and popular will cause a 400 error'''

        url = build_url('feed', get={
            'is_interesting': 'on',
            'is_popular': 'on',
        })

        self.get_posts()[:3]

        self.authenticate(self.token)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data.get('error').code, 'invalid_filters')
    
    def test_filter_posts_by_created_at(self):
        '''Test filter posts by created at'''

        # -created_at

        url = build_url('feed', get={
            'ordering': '-created_at'
        })
        
        posts_qs = self.get_posts()

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts_qs[:3], many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)

        posts_qs.delete()

        # created_at

        url = build_url('feed', get={
            'ordering': 'created_at'
        })
        
        posts = self.get_posts().order_by('created_at')[:3]
        
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)

    def test_filter_posts_by_popular(self):
        '''Test filter posts by popular'''

        url = build_url('feed', get={
            'is_popular': 'on'
        })

        posts = self.get_posts()
        posts[1].like(self.user)

        posts = posts.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt', '-created_at')[:3]

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)
    
    def test_filter_posts_by_interesting(self):
        '''Test filter posts by interesting'''

        url = build_url('feed', get={
            'is_interesting': 'on'
        })

        user = User.objects.create_user(
        'PostsTestCaseFilterInteresting',
        'poststestcasefilterinteresting@gmail.com',
        self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        posts = self.get_posts()
        post = posts[1]

        post.author = user
        post.save()

        following = self.user.profile.following
        posts = posts.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
            .order_by('-flag', '-created_at')[:3]
            
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)
    
    def test_filter_posts_by_popular_and_created_at(self):
        '''Test filter posts by popular and created at'''

        # -created_at

        url = build_url('feed', get={
            'ordering': '-created_at',
            'is_popular': 'on',
        })
        
        posts_qs = self.get_posts()
        
        posts_qs[2].like(self.user)
        posts_qs[1].like(self.user)

        posts = posts_qs.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt', '-created_at')[:3]
        
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)

        posts_qs.delete()

        # created_at
        
        url = build_url('feed', get={
            'ordering': 'created_at',
            'is_popular': 'on',
        })

        posts = self.get_posts()
        
        posts[2].like(self.user)
        posts[1].like(self.user)
        
        posts = posts.annotate(liked_cnt=Count('liked')).order_by('-liked_cnt', 'created_at')[:3]
        
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)
    
    def test_filter_posts_by_interesting_and_created_at(self):
        '''Test filter posts by interesting and created at'''

        # -created_at

        url = build_url('feed', get={
            'ordering': '-created_at',
            'is_interesting': 'on',
        })
        
        user = User.objects.create_user(
        'PostsTestCaseFilterInterestingAndCreatedat',
        'poststestcasefilterinterestingandcreatedat@gmail.com',
        self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        posts_qs = self.get_posts()

        post = posts_qs[1]
        post_two = posts_qs[2]

        post.author = user
        post.save()

        post_two.author = user
        post_two.save()

        following = self.user.profile.following
        posts = posts_qs.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
            .order_by('-flag', '-created_at')[:3]
            
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)

        posts_qs.delete()

        # created_at

        url = build_url('feed', get={
            'ordering': 'created_at',
            'is_interesting': 'on',
        })

        posts = self.get_posts()

        post = posts[1]
        post_two = posts[2]

        post.author = user
        post.save()

        post_two.author = user
        post_two.save()

        following = self.user.profile.following
        posts = posts.annotate(flag=Exists(following.filter(id=OuterRef('author__profile__id'))))\
            .order_by('-flag', 'created_at')[:3]
            
        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(instance=posts, many=True, context={'request': response.wsgi_request}).data
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('results'), serializer_data)