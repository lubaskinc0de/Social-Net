# Generated by Django 4.0.4 on 2022-09-11 16:00

from django.db import migrations, models
import main.helpers.helpers


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0044_alter_profile_avatar"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="avatar",
            field=models.ImageField(
                blank=True,
                default="default/default.png",
                upload_to=main.helpers.helpers.PathAndRenameDate(
                    "photos/avatars/2022/9/"
                ),
                verbose_name="Аватарка",
            ),
        ),
    ]
