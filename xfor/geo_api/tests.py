from rest_framework.test import APITestCase
from knox.models import AuthToken
from django.contrib.auth.models import User

from .serializers import CitySerializer, CountrySerializer
from .helpers import build_url
from .models import City, Country

class CitiesTestCase(APITestCase):
    '''Cities test'''

    def setUp(self) -> None:
        self.email = 'citiestestcase@gmail.com'
        self.password = 'asd123321'

        self.user: User = User.objects.create_user('CitiesTestCase', self.email, self.password)
        self.token: str = AuthToken.objects.create(user=self.user)[-1]
        self.country_id: int = Country.objects.create(name='USA', name_ascii='USA', continent='OC').id

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    def test_get_cities_authorized(self):
        '''A test to verify that an authorized user will receive a 403 error when trying to get cities'''

        url = build_url('cities', get={'country': self.country_id})
        self.authenticate(self.token)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 403)

    def test_get_cities_without_country(self):
        '''A test that a request without specifying the country will receive a response with the code 400'''

        url = build_url('cities')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)

    def test_get_cities_with_invalid_country(self):
        '''A test that a request with invalid country will receive a response with the code 400'''

        url = build_url('cities', get={'country': 2021919283})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data.get('country')[0].code, 'invalid_choice')

    def test_get_cities(self):
        '''Test of getting cities'''

        url = build_url('cities', get={'country': self.country_id})

        cities_objects = (City(
            display_name = 'CitiesTestCase' + str(i),
            name = 'CitiesTestCase' + str(i),
            alternate_names = 'CitiesTestCase' + str(i),
            country_id = self.country_id,
            name_ascii = 'CitiesTestCase' + str(i),
        ) for i in range(10))

        cities = City.objects.bulk_create(cities_objects)

        serializer_data = CitySerializer(instance=cities, many=True).data

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, serializer_data)

class CountriesTestCase(APITestCase):
    '''Countries test'''

    def setUp(self) -> None:
        self.email = 'countriestestcase@gmail.com'
        self.password = 'asd123321'

        self.user: User = User.objects.create_user('CountriesTestCase', self.email, self.password)
        self.token: str = AuthToken.objects.create(user=self.user)[-1]

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

    def test_get_countries_authorized(self):
        '''A test to verify that an authorized user will receive a 403 error when trying to get countries'''

        url = build_url('countries')
        self.authenticate(self.token)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 403)

    def test_get_countries(self):
        '''Test of getting countries'''

        url = build_url('countries')

        countries_objects = (Country(
            name='CountriesTestCase' + str(i),
            name_ascii='CountriesTestCase' + str(i),
            alternate_names='CountriesTestCase' + str(i),
            continent='OC'
        ) for i in range(10))

        countries = Country.objects.bulk_create(countries_objects)

        serializer_data = CountrySerializer(instance=countries, many=True).data

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, serializer_data)

