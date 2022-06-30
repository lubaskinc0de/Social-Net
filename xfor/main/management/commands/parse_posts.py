from django.core.management.base import BaseCommand
from ._parse_posts_tool import parser

'''Delete this on production, only for tests'''

class Command(BaseCommand):
    help = 'This commands parse posts from lenta.ru and write it to DB'

    def handle(self, *args, **options) -> str:
        parser.parse()
        return 'Parsing was end.'