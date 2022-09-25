from .fields import AlternateNameField
from rest_framework import serializers
from .models import Country, City, Region

class CountrySerializer(serializers.ModelSerializer):
    '''Country serializer'''

    alternate_names = AlternateNameField()

    class Meta:
        model = Country
        fields = ['id', 'alternate_names', 'code2', 'phone']

class RegionSerializer(serializers.ModelSerializer):
    '''Region serializer'''

    alternate_names = AlternateNameField()

    class Meta:
        model = Region
        fields = ['id', 'alternate_names', 'name']

class CitySerializer(serializers.ModelSerializer):
    '''CitySerializer'''
    
    alternate_names = AlternateNameField()
    country = CountrySerializer()
    region = RegionSerializer()

    class Meta:
        model = City
        fields = ['id', 'alternate_names', 'country', 'region']