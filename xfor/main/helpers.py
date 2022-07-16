'''
This is wrong, and it would be better to move it to where other_helpers are located
but the migration subsystem swears when we do this
'''

from django.utils.deconstruct import deconstructible
import datetime
from uuid import uuid4
import os

@deconstructible # сlass decorator that allows the decorated class to be serialized by the migrations subsystem.
class PathAndRename(object):

    def __init__(self, sub_path):
        self.path = sub_path # путь переданный в создании обьекта

    def __call__(self, instance, filename):
        # при вызове обьекта
        ext = filename.split('.')[-1] # получаем расширение
        filename = '{}.{}'.format(uuid4().hex, ext) # генерируем filename, uuid.ext это uuid без '-'
        return os.path.join(self.path, filename)

path_and_rename = PathAndRename(f'photos/posts/{datetime.datetime.now().year}/{datetime.datetime.now().month}/{datetime.datetime.now().day}/')
path_and_rename_avatar = PathAndRename(f'photos/{datetime.datetime.now().year}/{datetime.datetime.now().month}/{datetime.datetime.now().day}/')