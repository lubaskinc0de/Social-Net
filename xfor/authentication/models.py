from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models.signals import post_save
from django.dispatch import receiver
from main.helpers import path_and_rename_avatar

class Contact(models.Model):
    user_to = models.ForeignKey(User,related_name='to_set',on_delete=models.CASCADE,verbose_name='На')
    user_from = models.ForeignKey(User,related_name='from_set',on_delete=models.CASCADE,verbose_name='От')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True,verbose_name='Создано')

    class Meta:
        ordering = ('-created_at',)
        verbose_name = 'Подписка'
        verbose_name_plural = 'Подписки'
        # дальше пишем условие для добавления обьекта в бд
        constraints = [
            models.CheckConstraint(
                check =~ models.Q(user_from=models.F("user_to")), # само условие , проверяет что бы 2 поля модели не были равны, иначе исключение
                name = 'check_self_follow',
            )
        ]
 
    def __str__(self):
        return '{} подписан на {}'.format(self.user_from,self.user_to)


class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile',related_query_name='profile',verbose_name='Пользователь')
    created_at = models.DateTimeField(auto_now_add=True,verbose_name='Создан')
    bio = models.CharField(max_length=30,verbose_name='Статус',blank=True)
    avatar = models.ImageField(verbose_name='Аватарка',blank=True,upload_to=path_and_rename_avatar,default='default/default.png')
    
    def __str__(self) -> str:
        return self.user.username

    def get_absolute_url(self):
        return reverse('profile',kwargs={'pk':self.pk})

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профили'
        ordering = ['-created_at']


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


User.add_to_class('followers', models.ManyToManyField('self',through=Contact,related_name='following',symmetrical=False)) # динамически добавляем поле в модель User, первый аргумент название поля
