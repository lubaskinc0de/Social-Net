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