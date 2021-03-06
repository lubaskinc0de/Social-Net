# Generated by Django 4.0.4 on 2022-05-30 08:51

from django.db import migrations, models
import main.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0022_alter_profile_options_alter_profile_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(blank=True, default='default/default.png', upload_to=main.helpers.PathAndRename('photos/2022/5/30/'), verbose_name='Аватарка'),
        ),
        migrations.AlterField(
            model_name='token',
            name='token',
            field=models.CharField(editable=False, max_length=100, verbose_name='Токен'),
        ),
    ]
