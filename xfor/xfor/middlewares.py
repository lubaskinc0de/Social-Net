import logging
from django.utils import timezone as django_timezone
from django.conf import settings
from pytz import timezone
from pytz.exceptions import UnknownTimeZoneError

LOGGER = logging.getLogger('django.server')

class TimezoneMiddleware:
    '''Middleware that sets the time zone for the user based on the city he has chosen'''

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request) -> None:
        logger = LOGGER
        user = request.user

        def set_default_tz():
            request.timezone = timezone(settings.TIME_ZONE)

        if user.is_authenticated:
            
            try:
                tz = timezone(user.profile.city.timezone)
                django_timezone.activate(tz)
                request.timezone = tz

                logger.info(
                    '"%s" timezone: %s',
                    str(request.method), str(tz)
                )
            
            except UnknownTimeZoneError:
                logger.warning('Unknown timezone error, timezone: %s', str(tz))
                django_timezone.deactivate()
                set_default_tz()
                
            except AttributeError:
                django_timezone.deactivate()
                set_default_tz()
        else:
            set_default_tz()
        
        response = self.get_response(request)
        return response