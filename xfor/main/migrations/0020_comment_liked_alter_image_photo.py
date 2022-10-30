# Generated by Django 4.0.4 on 2022-05-15 10:27

from django.conf import settings
from django.db import migrations, models
import main.helpers.helpers


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0019_alter_image_photo_alter_image_post_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='liked',
            field=models.ManyToManyField(blank=True, related_name='liked_comments', related_query_name='liked_comments', to=settings.AUTH_USER_MODEL, verbose_name='Лайкнувшие'),
        ),
        migrations.AlterField(
            model_name='image',
            name='photo',
            field=models.ImageField(upload_to=main.helpers.helpers.PathAndRenameDate('photos/posts/2022/5/15/'), verbose_name='Фото'),
        ),
    ]
