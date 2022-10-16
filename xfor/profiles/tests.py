from rest_framework.test import APITestCase
from knox.models import AuthToken
from django.contrib.auth.models import User
from django.urls import reverse

from .serializers import ProfileSerializer

class ProfilesTestCase(APITestCase):
    '''Profiles test'''

    def setUp(self) -> None:
        self.email = 'profilestestcase@gmail.com'
        self.password = 'asd123321'

        self.user = User.objects.create_user('ProfilesTestCase', self.email, self.password)
        self.token: str = AuthToken.objects.create(self.user)[-1]

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    
    def test_get_me_not_authorized(self):
        'Test getting self profile unauthorized'

        url = reverse('profile_details')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)
    
    def test_get_me(self):
        '''Test getting self profile'''

        url = reverse('profile_details')
        self.authenticate(self.token)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        response.data.pop('avatar')

        serializer_data = ProfileSerializer(instance=self.user.profile).data
        serializer_data.pop('avatar')

        self.assertEqual(response.data, serializer_data)

