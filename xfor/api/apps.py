from django.apps import AppConfig

# TODO: remove this app
class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    verbose_name = "Утилиты API"
