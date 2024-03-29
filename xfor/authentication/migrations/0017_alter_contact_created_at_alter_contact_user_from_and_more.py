# Generated by Django 4.0.4 on 2022-05-14 10:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("authentication", "0016_alter_profile_avatar"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contact",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, db_index=True, verbose_name="Создано"
            ),
        ),
        migrations.AlterField(
            model_name="contact",
            name="user_from",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="from_set",
                to=settings.AUTH_USER_MODEL,
                verbose_name="На",
            ),
        ),
        migrations.AlterField(
            model_name="contact",
            name="user_to",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="to_set",
                to=settings.AUTH_USER_MODEL,
                verbose_name="От",
            ),
        ),
    ]
