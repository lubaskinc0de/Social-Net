from rest_framework.test import APITestCase
from rest_framework.settings import api_settings

from django.contrib.auth.models import User
from django.urls import reverse

from .serializers import ProfileSerializer

from geo_api.models import Country, City
from authentication.models import Profile
from knox.models import AuthToken

from datetime import datetime, timedelta


class ProfilesTestCase(APITestCase):
    """Profiles test"""

    def setUp(self) -> None:
        self.email = "profilestestcase@gmail.com"
        self.password = "asd123321"

        self.user = User.objects.create_user(
            "ProfilesTestCase",
            self.email,
            self.password,
            first_name="John",
            last_name="Pauls",
        )
        self.user.profile.delete()

        self.birthday = (
            (datetime.today() - timedelta(days=(365 * 15))).date().strftime("%Y-%m-%d")
        )
        self.country_id: int = Country.objects.create(
            name="Russia", name_ascii="Russia", continent="OC", alternate_names="Россия"
        ).id
        self.city_id: int = City.objects.create(
            name="Moscow",
            name_ascii="Moscow",
            timezone="Moscow/Russia",
            display_name="Moscow",
            country_id=self.country_id,
            alternate_names="Москва",
        ).id

        self.token: str = AuthToken.objects.create(self.user)[-1]

    def authenticate(self, token: str) -> None:
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)

    def setup_user_profile(self, user: User) -> Profile:
        """Fill in the profile with test data"""

        user.profile.birthday = self.birthday
        user.profile.city_id = self.city_id

        user.profile.save()

        return user.profile

    def create_profiles(self) -> list[Profile]:
        """Fill the Profile model"""

        page_size = api_settings.PAGE_SIZE

        profiles = [
            self.setup_user_profile(
                User.objects.create_user(
                    "ProfilesTestCaseGetProfiles" + str(i),
                    "profilestestcasegetprofiles@gmail.com",
                    self.password,
                    first_name="Test" + str(i),
                )
            )
            for i in range(page_size)
        ]

        return profiles

    def test_get_me_not_authorized(self):
        """Test getting self profile unauthorized"""

        url = reverse("profile_details")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_get_me(self):
        """Test getting self profile"""

        url = reverse("profile_details")
        self.authenticate(self.token)

        profile = self.setup_user_profile(self.user)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        serializer_data = ProfileSerializer(instance=profile).data

        self.assertEqual(response.data, serializer_data)

    def test_get_profiles_not_authorized(self):
        """Test getting profiles not authorized"""

        url = reverse("profiles")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)

    def test_get_profiles(self):
        """Test getting profiles"""

        url = reverse("profiles")
        self.authenticate(self.token)

        self.create_profiles()
        profiles = Profile.objects.all()

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        serializer_data = ProfileSerializer(instance=profiles, many=True).data

        self.assertEqual(response.data.get("results"), serializer_data)

    def test_get_profile(self):
        """Test getting profile"""

        self.create_profiles()
        profile = Profile.objects.last()

        url = reverse("profile", kwargs={"pk": profile.id})
        self.authenticate(self.token)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        serializer_data = ProfileSerializer(instance=profile).data

        self.assertEqual(response.data, serializer_data)
