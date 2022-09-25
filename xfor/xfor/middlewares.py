from django.utils.timezone import activate
from pytz import timezone
from pytz.exceptions import UnknownTimeZoneError
import logging

class TimezoneMiddleware:
    '''Middleware that sets the time zone for the user based on the city he has chosen'''

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request) -> None:
        response = self.get_response(request)

        if not request.user.is_authenticated:
            return response
            
        try:
            tz = timezone(request.user.profile.city.timezone)
            activate(tz)
        except UnknownTimeZoneError:
            logger = logging.getLogger(__name__)
            logger.error(f'Unknown timezone error, timezone: {tz}')
            activate('UTC')
        except AttributeError:
            activate('UTC')
        
        return response