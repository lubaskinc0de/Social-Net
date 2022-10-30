# Generated by Django 4.0.4 on 2022-05-14 10:06

from django.db import migrations, models
import django.db.models.deletion
import main.helpers.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0016_alter_profile_avatar'),
        ('main', '0018_alter_comment_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='photo',
            field=models.ImageField(upload_to=main.helpers.helpers.PathAndRenameDate('photos/posts/2022/5/14/'), verbose_name='Фото'),
        ),
        migrations.AlterField(
            model_name='image',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', related_query_name='images', to='main.post', verbose_name='Пост'),
        ),
        migrations.AlterField(
            model_name='post',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='posts_profile', to='authentication.profile', verbose_name='Профиль'),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(blank=True, max_length=150, verbose_name='Название'),
        ),
    ]
