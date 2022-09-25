# Generated by Django 4.0.4 on 2022-09-18 19:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0048_alter_profile_bio'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='contact',
            options={'ordering': ('-created_at',), 'verbose_name': 'подписк(а-у)', 'verbose_name_plural': 'Подписки'},
        ),
        migrations.AlterModelOptions(
            name='customauthtoken',
            options={'verbose_name': 'токен', 'verbose_name_plural': 'Токены'},
        ),
        migrations.AlterModelOptions(
            name='profile',
            options={'ordering': ['-created_at'], 'verbose_name': 'профиль', 'verbose_name_plural': 'Профили'},
        ),
    ]