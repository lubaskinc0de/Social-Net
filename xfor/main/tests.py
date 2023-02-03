from datetime import timedelta
from django.utils import timezone

from rest_framework.test import APITestCase
from rest_framework.settings import api_settings

from knox.models import AuthToken
from django.contrib.auth.models import User
from django.db.models import Count, OuterRef, Exists

from .models import Post, PostCategory, Comment

from django.urls import reverse
from geo_api.helpers import build_url

from .serializers import PostSerializer, PostCategorySerializer, CommentSerializer
from .services import get_posts as get_posts_queryset, get_post_comments


class PostsTestCase(APITestCase):
    """Posts test"""

    def setUp(self) -> None:
        self.email = "poststestcase@gmail.com"
        self.password = "asd123321"

        self.user = User.objects.create_user("PostsTestCase", self.email, self.password)
        self.token: str = AuthToken.objects.create(self.user)[-1]

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

    def create_posts(self, page_size: int) -> None:
        """Fill the Post model"""

        post_objects = (
            Post(
                profile=self.user.profile,
                title="Post " + str(i),
                content="lorem ipsum",
                author=self.user,
            )
            for i in range(page_size)
        )

        posts = Post.objects.bulk_create(post_objects)

        for i, post in enumerate(posts):
            # Because we cannot set the created_at field immediately when creating an object
            post.created_at = timezone.now() + timedelta(minutes=i)
            post.save()

    def get_posts(self, page_size: int = api_settings.PAGE_SIZE):
        """Create posts and return ready queryset"""

        self.create_posts(page_size)

        return get_posts_queryset(self.user)

    def test_get_posts_not_authorized(self):
        """Test getting posts not authorized"""

        url = reverse("feed")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_put_posts(self):
        """Test PUT request to posts raises 405 HTTP error"""

        url = reverse("feed")
        self.get_posts()

        self.authenticate(self.token)
        response = self.client.put(url)

        self.assertEqual(response.status_code, 405)

    def test_get_posts(self):
        """Test getting posts"""

        url = reverse("feed")
        posts = self.get_posts()

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_get_categories(self):
        """Test getting post categories"""

        url = reverse("post_categories")
        categories = PostCategory.objects.all()

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostCategorySerializer(instance=categories, many=True).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, serializer_data)

    def test_get_posts_by_page(self):
        """Test getting posts"""

        url = build_url(
            "feed",
            get={
                "page": 2,
            },
        )

        posts = self.get_posts(10)[3:6]

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_filter_posts_by_interesting_and_popular_will_cause_a_error(self):
        """A test filter of posts by interesting and popular will cause a 400 error"""

        url = build_url(
            "feed",
            get={
                "is_interesting": "on",
                "is_popular": "on",
            },
        )

        self.get_posts()

        self.authenticate(self.token)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data.get("error").code, "invalid_filters")

    def test_filter_posts_by_created_at(self):
        """Test filter posts by created at"""

        # -created_at

        url = build_url("feed", get={"ordering": "-created_at"})

        posts_qs = self.get_posts()

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts_qs, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts_qs.delete()

        # created_at

        url = build_url("feed", get={"ordering": "created_at"})

        posts = self.get_posts().order_by("created_at")

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_category_posts(
        self, category: PostCategory, posts: list[Post], category_posts_limit: int = 2
    ):
        """Get filtered by category posts"""

        for post in posts[0:category_posts_limit]:
            post.category = category
            post.save()

        posts = posts.filter(category=category)

        return posts

    def test_filter_posts_by_category(self):
        """Test filter posts by category"""

        category = PostCategory.objects.create(title="Спорт")
        url = build_url("feed", get={"category": category.id})

        posts = self.get_filtered_by_category_posts(category, self.get_posts())

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_popular_posts(self, user: User, posts: list[Post]):
        """Get filtered by popular posts"""

        posts[1].like(user)

        posts = posts.annotate(liked_cnt=Count("liked")).order_by(
            "-liked_cnt", "-created_at"
        )

        return posts

    def test_filter_posts_by_popular(self):
        """Test filter posts by popular"""

        url = build_url("feed", get={"is_popular": "on"})

        posts = self.get_filtered_by_popular_posts(self.user, self.get_posts())

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_interesting_posts(self, user: User, posts: list[Post]):
        """Get filtered by interesting posts"""

        post = posts[1]

        post.author = user
        post.save()

        following = self.user.profile.following
        posts = posts.annotate(
            flag=Exists(following.filter(id=OuterRef("author__profile__id")))
        ).order_by("-flag", "-created_at")

        return posts

    def test_filter_posts_by_interesting(self):
        """Test filter posts by interesting"""

        url = build_url("feed", get={"is_interesting": "on"})

        user = User.objects.create_user(
            "PostsTestCaseFilterInteresting",
            "poststestcasefilterinteresting@gmail.com",
            self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        posts = self.get_filtered_by_interesting_posts(user, self.get_posts())

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_popular_and_ordering_posts(
        self, ordering: str, user: User, posts: list[Post]
    ):
        """Get filtered by popular posts with ORDER_BY=ordering"""

        posts[2].like(user)
        posts[1].like(user)

        posts = posts.annotate(liked_cnt=Count("liked")).order_by(
            "-liked_cnt", ordering
        )

        return posts

    def test_filter_posts_by_popular_and_created_at(self):
        """Test filter posts by popular and created at"""

        # -created_at

        url = build_url(
            "feed",
            get={
                "ordering": "-created_at",
                "is_popular": "on",
            },
        )

        posts = self.get_filtered_by_popular_and_ordering_posts(
            "-created_at", self.user, self.get_posts()
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts.delete()

        # created_at

        url = build_url(
            "feed",
            get={
                "ordering": "created_at",
                "is_popular": "on",
            },
        )

        posts = self.get_filtered_by_popular_and_ordering_posts(
            "created_at", self.user, self.get_posts()
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_interesting_and_ordering_posts(
        self, ordering: str, user: User, posts: list[Post]
    ):
        """Get filtered by interesting posts with ORDER_BY=ordering"""

        post = posts[1]
        post_two = posts[2]

        post.author = user
        post.save()

        post_two.author = user
        post_two.save()

        following = self.user.profile.following
        posts = posts.annotate(
            flag=Exists(following.filter(id=OuterRef("author__profile__id")))
        ).order_by("-flag", ordering)

        return posts

    def test_filter_posts_by_interesting_and_created_at(self):
        """Test filter posts by interesting and created at"""

        # -created_at

        url = build_url(
            "feed",
            get={
                "ordering": "-created_at",
                "is_interesting": "on",
            },
        )

        user = User.objects.create_user(
            "PostsTestCaseFilterInterestingAndCreatedat",
            "poststestcasefilterinterestingandcreatedat@gmail.com",
            self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        posts = self.get_filtered_by_interesting_and_ordering_posts(
            "-created_at", user, self.get_posts()
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts.delete()

        # created_at

        url = build_url(
            "feed",
            get={
                "ordering": "created_at",
                "is_interesting": "on",
            },
        )

        posts = self.get_filtered_by_interesting_and_ordering_posts(
            "created_at", user, self.get_posts()
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def get_filtered_by_category_and_ordering_posts(
        self, ordering: str, category: PostCategory
    ):
        """Get filtered by category posts with ORDER_BY=ordering"""

        posts = self.get_posts()

        post = posts[1]
        post_two = posts[2]

        post.category = category
        post.save()

        post_two.category = category
        post_two.save()

        posts = posts.filter(category=category).order_by(ordering)

        return posts

    def test_filter_posts_by_category_and_created_at(self):
        """Test filter posts by category and created at"""

        # -created_at

        category = PostCategory.objects.create(title="Спорт")

        url = build_url(
            "feed",
            get={"ordering": "-created_at", "category": category.id},
        )

        posts = self.get_filtered_by_category_and_ordering_posts(
            "-created_at", category
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts.delete()

        # created_at

        url = build_url(
            "feed",
            get={"ordering": "created_at", "category": category.id},
        )

        posts = self.get_filtered_by_category_and_ordering_posts("created_at", category)

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_filter_posts_by_category_and_popular(self):
        """Test filter posts by category and popular"""

        category = PostCategory.objects.create(title="Спорт")
        url = build_url("feed", get={"category": category.id, "is_popular": "on"})

        category_posts = self.get_filtered_by_category_posts(category, self.get_posts())

        posts = self.get_filtered_by_popular_posts(self.user, category_posts)

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_filter_posts_by_category_and_interesting(self):
        """Test filter posts by category and interesting"""

        category = PostCategory.objects.create(title="Спорт")
        url = build_url("feed", get={"category": category.id, "is_interesting": "on"})

        user = User.objects.create_user(
            "PostsTestCaseFilterInteresting",
            "poststestcasefilterinteresting@gmail.com",
            self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        category_posts = self.get_filtered_by_category_posts(category, self.get_posts())
        posts = self.get_filtered_by_interesting_posts(user, category_posts)

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_filter_posts_by_category_and_popular_and_created_at(self):
        """Test filter posts by category, popular and created at"""

        # -created_at

        category = PostCategory.objects.create(title="Спорт")
        url = build_url(
            "feed",
            get={
                "ordering": "-created_at",
                "is_popular": "on",
                "category": category.id,
            },
        )

        category_posts = self.get_filtered_by_category_posts(
            category, self.get_posts(), 3
        )

        posts = self.get_filtered_by_popular_and_ordering_posts(
            "-created_at", self.user, category_posts
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts.delete()

        # created_at

        url = build_url(
            "feed",
            get={
                "ordering": "created_at",
                "is_popular": "on",
                "category": category.id,
            },
        )

        category_posts = self.get_filtered_by_category_posts(
            category, self.get_posts(), 3
        )

        posts = self.get_filtered_by_popular_and_ordering_posts(
            "created_at", self.user, category_posts
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_filter_posts_by_category_and_interesting_and_created_at(self):
        """Test filter posts by category, interesting and created at"""

        # -created_at

        category = PostCategory.objects.create(title="Спорт")
        url = build_url(
            "feed",
            get={
                "ordering": "-created_at",
                "is_interesting": "on",
                "category": category.id,
            },
        )

        category_posts = self.get_filtered_by_category_posts(
            category, self.get_posts(), 3
        )

        user = User.objects.create_user(
            "PostsTestCaseFilterInterestingAndCreatedat",
            "poststestcasefilterinterestingandcreatedat@gmail.com",
            self.password,
        )

        user.profile.followers.add(self.user.profile)
        user.profile.save()

        posts = self.get_filtered_by_interesting_and_ordering_posts(
            "-created_at", user, category_posts
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

        posts.delete()

        # created_at

        url = build_url(
            "feed",
            get={
                "ordering": "created_at",
                "is_interesting": "on",
                "category": category.id,
            },
        )

        category_posts = self.get_filtered_by_category_posts(
            category, self.get_posts(), 3
        )

        posts = self.get_filtered_by_interesting_and_ordering_posts(
            "created_at", user, category_posts
        )

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=posts, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)

    def test_put_post(self):
        """Test PUT request to post raises 405 HTTP error"""

        post = self.get_posts(3).last()

        url = reverse("post", kwargs={"pk": post.id})

        self.authenticate(self.token)
        response = self.client.put(url)

        self.assertEqual(response.status_code, 405)

    def test_get_post(self):
        """Test getting post"""

        post = self.get_posts(3).last()

        url = reverse("post", kwargs={"pk": post.id})

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = PostSerializer(
            instance=post, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, serializer_data)


class CommentsTestCase(APITestCase):
    """Comments test"""

    def setUp(self) -> None:
        self.email = "commentstestcase@gmail.com"
        self.password = "asd123321"

        self.user = User.objects.create_user(
            "CommentsTestCase", self.email, self.password
        )
        self.token: str = AuthToken.objects.create(self.user)[-1]

        self.post = Post(
            profile=self.user.profile,
            title="Post 1",
            content="lorem ipsum",
            author=self.user,
        )

        self.post.save()

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

    def create_comments(self, page_size: int) -> None:
        """Fill the Comments model"""

        comment_objects = (
            Comment(
                post=self.post,
                author=self.user,
                body="lorem ipsum",
                lft=0,
                rght=0,
                tree_id=0,
                level=0,
            )
            for _ in range(page_size)
        )

        comments = Comment.objects.bulk_create(comment_objects)

        return comments

    def get_comments(self, page_size: int = api_settings.PAGE_SIZE):
        """Create comments and return ready queryset"""

        self.create_comments(page_size)

        return get_post_comments(self.user, self.post.id)

    def test_get_comments_not_authorized(self):
        """Test getting comments not authorized"""

        url = reverse("post_comments", kwargs={"pk": self.post.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_get_comments(self):
        """Test getting comments"""

        url = reverse("post_comments", kwargs={"pk": self.post.id})

        comments = self.get_comments()

        self.authenticate(self.token)
        response = self.client.get(url)

        serializer_data = CommentSerializer(
            instance=comments, many=True, context={"request": response.wsgi_request}
        ).data

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("results"), serializer_data)
