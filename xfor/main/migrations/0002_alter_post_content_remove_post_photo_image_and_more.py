# Generated by Django 4.0.4 on 2022-04-19 19:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("main", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="content",
            field=models.TextField(blank=True, verbose_name="Контент"),
        ),
        migrations.RemoveField(
            model_name="post",
            name="photo",
        ),
        migrations.CreateModel(
            name="Image",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "photo",
                    models.ImageField(
                        blank=True,
                        upload_to="photos/posts/%Y/%m/%d/",
                        verbose_name="Фото",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Автор",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="post",
            name="photo",
            field=models.ManyToManyField(
                blank=True,
                related_name="posts",
                related_query_name="posts",
                to="main.image",
                verbose_name="Фотографии",
            ),
        ),
    ]
