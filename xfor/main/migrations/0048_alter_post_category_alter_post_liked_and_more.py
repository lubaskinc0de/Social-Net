# Generated by Django 4.0.4 on 2022-12-12 19:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("authentication", "0053_alter_profile_avatar"),
        ("main", "0047_postcategory_alter_post_content_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="posts",
                related_query_name="posts",
                to="main.postcategory",
                verbose_name="Категория",
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="liked",
            field=models.ManyToManyField(
                blank=True,
                related_name="liked_posts",
                related_query_name="liked_posts",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Лайкнувшие",
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="profile",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="posts",
                related_query_name="posts",
                to="authentication.profile",
                verbose_name="Профиль",
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="viewers",
            field=models.ManyToManyField(
                blank=True,
                related_name="viewed_posts",
                related_query_name="viewed_posts",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Просмотры",
            ),
        ),
    ]
