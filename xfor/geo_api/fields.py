from rest_framework import serializers

class AlternateNameField(serializers.Field):

    def to_representation(self, value: str) -> str:
        '''
        Turns a string of the form 'Republic of Belarus: Belarus; Belarus' in a line like 'Belarus'
        '''
        result = value.split(';')[-1] if ';' in value else value
        return result