from django.forms.fields import ImageField as ImageFieldValidator
from rest_framework import serializers

def run_images_validators(images):
    if images == []:
        return

    if len(images) > 10:
        raise serializers.ValidationError(detail={'length':'Недопустимое кол-во файлов, максимальное кол-во файлов - 10'})
        
    images_validator(images)
    
def images_validator(images):
    img_validator = ImageFieldValidator().to_python
    
    for image in images:
        if image.size / 1024 / 1024 > 8:
            raise serializers.ValidationError(detail={'file': 'Файл, который вы загрузили, слишком большой.'})
        img_validator(image)