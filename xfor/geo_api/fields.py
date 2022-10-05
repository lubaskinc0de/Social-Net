from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes


@extend_schema_field(OpenApiTypes.STR)
class AlternateNameField(serializers.Field):

    def to_representation(self, value: str) -> str:
        '''
        Turns a string of the form 'Republic of Belarus: Belarus; Belarus' in a line like 'Belarus'
        '''
        result = value.split(';')[-1] if ';' in value else value
        return result