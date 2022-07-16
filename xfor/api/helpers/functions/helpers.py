from rest_framework.exceptions import ValidationError

def validate_id(id):
    if type(id) not in (int, str):
        return False
    if type(id == str):
        return id.isdigit()
    return True

def validate_like_request_data(request, model_name: str) -> int:
    try:
        model_id = request.data.get(f'{model_name}_id')
    except AttributeError:
        raise ValidationError(detail={'error': 'Invalid data format.'})
    if not model_id:
        raise ValidationError(detail={'error': 'Model id not passed to request.'})
    if not (validate_id(model_id)):
        raise ValidationError(detail={'error': 'Model id is not a digit!'})
    return model_id

def validate_comment_request_data(request) -> tuple:
    try:
        post_id, body = request.data.get('post_id'), request.data.get('body')
    except AttributeError:
        raise ValidationError(detail={'error': 'Invalid data format.'})
    if (not post_id) or (not body):
        raise ValidationError(detail={'error': 'Invalid data.'})
    if not (body):
        raise ValidationError(detail={'error': 'Body is empty.'})
    if not (validate_id(post_id)):
        raise ValidationError(detail={'error': 'Post id is not a digit!'})
    return (post_id, body)