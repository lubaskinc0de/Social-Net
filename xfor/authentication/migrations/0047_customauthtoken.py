# Generated by Django 4.0.4 on 2022-09-15 08:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("knox", "0008_remove_authtoken_salt"),
        ("authentication", "0046_alter_profile_city"),
    ]

    operations = [
        migrations.CreateModel(
            name="CustomAuthToken",
            fields=[],
            options={
                "verbose_name": "Токен",
                "verbose_name_plural": "Токены",
                "proxy": True,
                "indexes": [],
                "constraints": [],
            },
            bases=("knox.authtoken",),
        ),
    ]
