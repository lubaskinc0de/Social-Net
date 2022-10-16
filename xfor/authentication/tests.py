from base64 import b64encode
import os
from django.contrib.auth.models import User
from django.urls import reverse
from knox.models import AuthToken
from rest_framework.test import APITestCase
from string import ascii_letters
from .tokens import authentication_token
from djoser.utils import encode_uid
from .models import Profile
from datetime import datetime, timedelta
from geo_api.models import City, Country
from rest_framework.response import Response
from django.conf import settings
import copy

class AuthenticationTestCase(APITestCase):
    '''Registration and login test'''

    def setUp(self) -> None:
        self.email = 'authenticationtestcaseuser@gmail.com'
        self.email_register = 'authenticationtestcase@gmail.com'
        self.username = 'AuthenticationTest'
        self.first_name = 'Илья'
        self.last_name = 'Муромец'
        self.password = 'asd123321'
        self.birthday = (datetime.today() - timedelta(days=(365 * 15))).date().strftime('%Y-%m-%d')
        self.country_id: int = Country.objects.create(name='Russia', name_ascii='Russia', continent='OC').id
        self.media_path = os.path.join(settings.TESTS_MEDIA_ROOT, 'authentication')
        
        with open(os.path.join(self.media_path, 'avatar.jpg'), 'rb') as file:
            self.avatar = b64encode(file.read())

        with open(os.path.join(self.media_path, 'fakeavatar.txt'), 'rb') as file:
            self.fake_avatar = b64encode(file.read())
        
        self.city_id: int = City.objects.create(
            name='Moscow', name_ascii='Moscow', timezone='Moscow/Russia',
            display_name='Moscow', country_id=self.country_id).id

        self.user: User = User.objects.create_user('AuthenticationTestUser', self.email, self.password)
        self.token: str = AuthToken.objects.create(user=self.user)[-1]

        self.register_data = {
            'email': self.email_register,
            'username': self.username,
            'password': self.password,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile': {
                'birthday': self.birthday,
                'city': self.city_id,
                'avatar': self.avatar,
                }
            }
        
        self.login_data = {'username': self.user.username, 'password': self.password}
    
    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
    
    def login(self):
        url = reverse('login')
        data = self.login_data
        response = self.client.post(url, data)

        return response
    
    def logout(self):
        url = reverse('logout')
        data = {}
        response = self.client.post(url, data)

        return response
    
    def logoutall(self):
        url = reverse('logout_all')
        data = {}
        response = self.client.post(url, data)

        return response
    
    def test_register_authorized(self):
        '''A test to verify that an authorized user will receive a 403 error when trying to register'''

        url = reverse('reg')
        data = self.register_data
        self.authenticate(self.token)
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 403)

    def test_login_authorized(self):
        '''A test to verify that an authorized user will receive a 403 error when trying to login'''

        self.authenticate(self.token)
        response = self.login()

        self.assertEqual(response.status_code, 403)
    
    def test_get_login(self):
        '''A test to verify that will receive a 405 error when trying GET request to login'''

        url = reverse('login')
        data = self.login_data
        response = self.client.get(url, data)

        self.assertEqual(response.status_code, 405)

    def test_get_register(self):
        '''A test to verify that will receive a 405 error when trying GET request to register'''

        url = reverse('reg')
        data = self.register_data
        response = self.client.get(url, data, format='json')

        self.assertEqual(response.status_code, 405)
    
    def activate_user(self, token: str, uid: str) -> Response:
        '''Activate the user and return response'''

        url = reverse('activate', kwargs={'uid': uid, 'token': token})
        response = self.client.get(url)

        return response
    
    def test_registration_and_activation_and_login(self):
        '''A test that tries to register and activate user and then performs a login'''

        url = reverse('reg')
        data = self.register_data

        response = self.client.post(url, data, format='json')
        register_response_data = response.data
        self.assertEqual(response.status_code, 201)

        users = User.objects.filter(username=register_response_data.get('username'))
        self.assertTrue(users.exists())

        user: User = users.first()

        self.assertTrue(Profile.objects.filter(user=user).exists())
        self.assertFalse(user.is_active)

        avatar_url = f'http://testserver{user.profile.avatar.url}'
        self.assertEqual(register_response_data, {
            'username': data.get('username'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'is_active': False,
            'profile': {
                'avatar': avatar_url,
                'birthday': data.get('profile').get('birthday'),
                'city': data.get('profile').get('city'),
            }
        })
        
        activation_token = authentication_token.make_token(user)
        uid = encode_uid(user.id)

        response = self.activate_user(activation_token, uid)

        self.assertEqual(response.status_code, 204)
        user.refresh_from_db()
        self.assertTrue(user.is_active)

        url = reverse('login')
        data = {
            'username': register_response_data.get('username'),
            'password': self.password,
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data)
        self.assertTrue('expiry' in response.data)
        self.assertTrue('user' in response.data)

        user.delete() # clearing user

    def test_registration_with_no_avatar(self):
        '''
        A test that verifies that registering without specifying an avatar will
        give the user a default avatar
        '''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['profile']['avatar'] = None

        response = self.client.post(url, data, format='json')
        register_response_data = response.data
        self.assertEqual(response.status_code, 201)

        users = User.objects.filter(username=register_response_data.get('username'))
        self.assertTrue(users.exists())

        user: User = users.first()

        self.assertTrue(Profile.objects.filter(user=user).exists())
        self.assertFalse(user.is_active)

        avatar_url = f'http://testserver/tests-media/default/default.png'
        self.assertEqual(register_response_data, {
            'username': data.get('username'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'is_active': False,
            'profile': {
                'avatar': avatar_url,
                'birthday': data.get('profile').get('birthday'),
                'city': data.get('profile').get('city'),
            }
        })

        user.delete() # clearing user
    
    def test_activate_user(self):
        '''A test that tries activate non-active user'''

        inactive_user: User = User.objects.create_user('AuthenticationTestCase_User_needs_activate', 'v1234@gmail.com', self.password)
        inactive_user.is_active = False
        inactive_user.save()

        token = authentication_token.make_token(inactive_user)
        uid = encode_uid(inactive_user.pk)

        response = self.activate_user(token, uid)

        self.assertEqual(response.status_code, 204)
        response = self.activate_user(token, uid)
        self.assertEqual(response.status_code, 400)
    
    def test_activate_user_authorized(self):
        '''A test that tries activate non-active user authorized'''

        inactive_user: User = User.objects.create_user('AuthenticationTestCase_User_needs_activate_authorized', 'v1234@gmail.com', self.password)
        inactive_user.is_active = False
        inactive_user.save()

        token = authentication_token.make_token(inactive_user)
        uid = encode_uid(inactive_user.pk)

        self.authenticate(self.token)
        response = self.activate_user(token, uid)

        self.assertEqual(response.status_code, 403)
    
    def test_registration_without_data(self):
        '''A test that tries to register without data'''

        url = reverse('reg')
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)

    def test_login_without_data(self):
        '''A test that tries to login without data'''

        url = reverse('login')
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
    
    def test_login_with_bad_credentials(self):
        '''A test that tries to login with bad credentials'''

        url = reverse('login')
        data = {
            'username': self.username,
            'password': 'bla123321fthaapqkd111',
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('non_field_errors')[0].code, 'authorization')
    
    def test_login_with_inactive_account(self):
        '''A test that tries to login with inactive account'''
        inactive_user: User = User.objects.create_user('Authentication_test_case_Inactive', self.email, self.password)
        inactive_user.is_active = False
        inactive_user.save()

        url = reverse('login')
        data = {
            'username': inactive_user.username,
            'password': self.password,
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('non_field_errors')[0].code, 'authorization')

    def test_registration_without_first_and_last_name(self):
        '''A test that tries to register without first and last names'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data.pop('first_name')
        data.pop('last_name')

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data.get('first_name')[0].code, 'required')
        self.assertEqual(response.data.get('last_name')[0].code, 'required')

    def test_registration_without_profile(self):
        '''A test that tries to register without first and last names'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data.pop('profile')

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('profile')[0].code, 'required')

    def test_registration_without_birthday_and_city(self):
        '''A test that tries to register without birthday and city'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['profile'].pop('birthday')
        data['profile'].pop('city')

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')

        self.assertEqual(len(profile), 2)
        self.assertEqual(profile.get('city')[0].code, 'required')
        self.assertEqual(profile.get('birthday')[0].code, 'required')

    def test_registration_with_bad_password(self):
        '''A test that tries to register with bad password'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['password'] = 'asd1233'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('password')[0].code, 'password_too_short')

        data = copy.deepcopy(self.register_data)
        data['password'] = 'qwerty1234'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('password')[0].code, 'password_too_common')

    def test_registration_with_bad_email(self):
        '''A test that tries to register with bad email'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['email'] = 'blablalb'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('email')[0].code, 'invalid')

    def test_registration_with_bad_username(self):
        '''A test that tries to register with bad username'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['username'] = 'A*()!!371'
        
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('username')[0].code, 'invalid')

        data = copy.deepcopy(self.register_data)
        data['username'] = 'Abo'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('username')[0].code, 'min_length')

        data = copy.deepcopy(self.register_data)
        data['username'] = ascii_letters

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('username')[0].code, 'max_length')

        data = copy.deepcopy(self.register_data)
        data['username'] = 1111
            
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('username')[0].code, 'username_contains_only_digits')
    
    def test_registration_with_existing_username(self):
        '''A test that tries to register with already existing username'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['username'] = self.user.username
        
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('username')[0].code, 'unique')
    
    def test_registration_with_bad_first_name(self):
        '''Test register with bad first_name'''

        url = reverse('reg')
        data = copy.deepcopy(self.register_data)
        data['first_name'] = ascii_letters

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('first_name')[0].code, 'max_length')

        data = copy.deepcopy(self.register_data)
        data['first_name'] = 'Jane1'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('first_name')[0].code, 'first_name_contains_digits')

    def test_registration_with_bad_last_name(self):
        '''Test register with invalid last_name'''

        url = reverse('reg')

        data = copy.deepcopy(self.register_data)
        data['last_name'] = ascii_letters

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('last_name')[0].code, 'max_length')

        data = copy.deepcopy(self.register_data)
        data['last_name'] = 'Harris1'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('last_name')[0].code, 'last_name_contains_digits')
    
    def test_registration_with_bad_avatar(self):
        '''Test register with invalid avatar'''

        url = reverse('reg')

        data = copy.deepcopy(self.register_data)
        data['profile']['avatar'] = self.fake_avatar

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('avatar')[0].code, 'invalid')

        data = copy.deepcopy(self.register_data)
        data['profile']['avatar'] = 'blabla'

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('avatar')[0].code, 'invalid')


    def test_registration_with_bad_birthday(self):
        '''Test register with invalid birthday'''

        url = reverse('reg')

        data = copy.deepcopy(self.register_data)
        data['profile']['birthday'] = 'alajhdeu'
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('birthday')[0].code, 'invalid')


        data = copy.deepcopy(self.register_data)
        data['profile']['birthday'] = datetime.now()
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('birthday')[0].code, 'invalid')

    def test_registration_with_age_less_than_fourteen(self):
        '''Test register with age less than fourteen'''

        url = reverse('reg')

        data = copy.deepcopy(self.register_data)
        data['profile']['birthday'] = (datetime.today() - timedelta(days=(365 * 10))).date().strftime('%Y-%m-%d')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('birthday')[0].code, 'age_less_than_fourteen')

    def test_registration_with_age_more_than_onehundred_forty(self):
        '''Test register with age more than one hundred forty'''

        url = reverse('reg')

        data = copy.deepcopy(self.register_data)
        data['profile']['birthday'] = (datetime.today() - timedelta(days=(365 * 142))).date().strftime('%Y-%m-%d')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)

        profile = response.data.get('profile')
        self.assertEqual(len(profile), 1)

        self.assertEqual(profile.get('birthday')[0].code, 'age_more_than_onehundred_forty')

    def test_two_tokens_not_compare(self):
        '''A test that the two tokens received during login will not be equal'''
        
        response = self.login()

        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data)
        
        first_token: str = response.data.get('token')

        response = self.login()

        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data)
        
        second_token: str = response.data.get('token')

        self.assertFalse(first_token == second_token)
    
    def test_logout(self):
        '''Test logout user'''

        # Login

        response = self.login()

        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.data)
        
        token: str = response.data.get('token')
        self.authenticate(token)

        # Logout

        response = self.logout()

        self.assertEqual(response.status_code, 204)
    
    def test_logout_not_authorized(self):
        '''Test logout user which not authorized'''
        
        response = self.logout()

        self.assertEqual(response.status_code, 401)
    
    def test_logoutall(self):
        '''Test logoutall user (destroy all tokens)'''

        # Login

        first_response, second_response = self.login(), self.login()
        responses = (first_response, second_response)

        self.assertTrue(all(map(lambda response: response.status_code == 200, responses)))
        self.assertTrue(all(map(lambda response: 'token' in response.data, responses)))

        first_token = first_response.data.get('token')
        self.authenticate(first_token)

        # Logout

        response = self.logoutall()

        self.assertEqual(response.status_code, 204)
    
    def test_logoutall_not_authorized(self):
        '''Test logoutall user (destroy all tokens) which not authorized'''

        response = self.logoutall()

        self.assertEqual(response.status_code, 401)


