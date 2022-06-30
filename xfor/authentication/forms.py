from django import forms
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm
from django.contrib.auth.models import User


class UserRegisterForm(UserCreationForm):
    username = forms.CharField(label='Логин',widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Логин"}))
    first_name = forms.CharField(label='Имя',required=True,widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Имя"}))
    last_name = forms.CharField(label='Фамилия',required=True,widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Фамилия"}))
    email = forms.EmailField(label='Email',widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Почта"}))
    password1 = forms.CharField(label='Пароль',widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Пароль"}))
    password2 = forms.CharField(label='Подтвердите пароль',widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Подтвердите пароль"}))
    
    class Meta:
        model = User
        fields = ('username','first_name','last_name','email','password1','password2')

class UserLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={"class":"register-form__input","placeholder":"Логин"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={"class":"register-form__input","placeholder":"Пароль"}))

    def clean_username(self):
        username = self.cleaned_data['username']
        user_obj = User.objects.get(username=username)
        if not user_obj.profile.is_verify:
            raise forms.ValidationError('Необходимо подтвердить почту!')
        return username