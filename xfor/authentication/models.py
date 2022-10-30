from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models.signals import post_save
from django.dispatch import receiver
from geo_api.models import City
from main.helpers.helpers import PathAndRenameDate
from knox.models import AuthToken

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile',related_query_name='profile',verbose_name='Пользователь')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    bio = models.CharField(max_length=100, verbose_name='Статус', blank=True)

    avatar = models.ImageField(verbose_name='Аватарка', blank=True, \
        upload_to=PathAndRenameDate('photos/avatars/'),
        default='default/default.png')

    followers = models.ManyToManyField('self', through='Contact', related_name='following', symmetrical=False)
    birthday = models.DateField(verbose_name='День рождения', null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, related_name='profile', null=True)

    def __str__(self) -> str:
        return self.user.username

    def get_absolute_url(self) -> str:
        return reverse('profile', kwargs={'pk': self.pk})

    class Meta:
        verbose_name = 'профиль'
        verbose_name_plural = 'Профили'
        ordering = ['-created_at']

class Contact(models.Model):
    user_to = models.ForeignKey(Profile,related_name='to_set',on_delete=models.CASCADE,verbose_name='На')
    user_from = models.ForeignKey(Profile,related_name='from_set',on_delete=models.CASCADE,verbose_name='От')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True,verbose_name='Создано')

    def __str__(self) -> str:
        return '{} подписан на {}'.format(self.user_from, self.user_to)

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'подписк(а-у)'
        verbose_name_plural = 'Подписки'
        constraints = [
            models.CheckConstraint(
                check =~ models.Q(user_from=models.F('user_to')), # Prohibits subscribing to yourself
                name = 'check_self_follow',
            )
        ]

class CustomAuthToken(AuthToken):
    '''AuthToken proxy model'''

    class Meta:
        verbose_name = 'токен'
        verbose_name_plural = 'Токены'
        proxy = True


@receiver(post_save, sender=User)
def create_user_profile(sender: User, instance: User, created: bool, **kwargs):
    if created:
        Profile.objects.create(user=instance)
