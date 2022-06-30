from django.core.exceptions import PermissionDenied
from uuid import uuid4
import os
from django.utils.deconstruct import deconstructible
import datetime

'''
переименование файлов
загружаемых пользователем
во избежании бэкдоров
'''

@deconstructible #сlass decorator that allows the decorated class to be serialized by the migrations subsystem.
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

def is_ajax(request):
    # ajax detect func
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest' # если этот параметр есть в METF значит это ajax запрос

def ajax_required(fn):
    '''
    ajax required decorator
    '''
    def wrapper(request,*args,**kwargs):
        if is_ajax(request):
            # узнаем ajax или нет по is_ajax функции
            return fn(request,*args,**kwargs) # и если все ок возвращаем контроллеру функцию обратно
        else:
            raise PermissionDenied()
    return wrapper

def validate_img_size(images) -> bool:
    for img in images:
        if img.size / 1024 / 1024 > 8:
            return False
    return True

def validate_img(images) -> bool:
    if images == []:
        return True

    elif len(images) <= 10:
        if validate_img_size(images=images):
            return True
    return False

def get_filters(GET) -> str:
    get_par = ''
    get_dict = dict(GET.items())
    get_dict.pop('page',None)
    if get_dict:
        get_par = '&'.join([f'{k}={v}' for k, v in get_dict.items()]) + '&'
    return str(get_par)
