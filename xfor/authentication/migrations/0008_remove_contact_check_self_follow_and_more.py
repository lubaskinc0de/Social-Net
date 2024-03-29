# Generated by Django 4.0.4 on 2022-04-18 20:53

from django.db import migrations, models
import django.db.models.expressions


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0007_remove_profile_followers_contact_and_more"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="contact",
            name="check_self_follow",
        ),
        migrations.AddConstraint(
            model_name="contact",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("user_from", django.db.models.expressions.F("user_to")),
                    _negated=True,
                ),
                name="check_self_follow",
            ),
        ),
    ]
