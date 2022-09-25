# Generated by Django 4.0.4 on 2022-08-19 17:39

from django.db import migrations, models
import main.helpers.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0040_profile_city_alter_profile_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, default='default/default.png', upload_to=main.helpers.helpers.PathAndRename('photos/2022/8/19/'), verbose_name='Аватарка'),
        ),
    ]