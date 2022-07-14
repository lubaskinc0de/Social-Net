from django.apps import AppConfig

# TODO: rename app to 'feed'
class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    verbose_name = 'Главная'
