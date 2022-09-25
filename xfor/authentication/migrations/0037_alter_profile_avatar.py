# Generated by Django 4.0.4 on 2022-08-13 07:10

from django.db import migrations, models
import main.helpers.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0036_alter_profile_birthday'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, default='default/default.png', upload_to=main.helpers.helpers.PathAndRename('photos/2022/8/13/'), verbose_name='Аватарка'),
        ),
    ]