from rest_framework.exceptions import ValidationError

def validate_like_request_data(request, model_name: str) -> int:
    try:
        model_id = request.data.get(f'{model_name}_id')
    except AttributeError:
        raise ValidationError(detail={'error': 'bad data format'})
    if not model_id:
        raise ValidationError(detail={'error': 'model id not passed to request'})
    return model_id
    
        