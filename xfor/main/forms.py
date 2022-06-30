from django import forms
from .models import Post,Comment

class PostForm(forms.ModelForm):
    images = forms.ImageField(required=False,widget=forms.FileInput(attrs={'multiple':True,'class':'fileinput','onchange':'validateimg(this)'})) # multiple разрешает загружать много файлов

    def clean(self):
        cleaned_data = super().clean()
        errors = {}

        if not cleaned_data.get('title',None) and not cleaned_data.get('content',None) and not cleaned_data.get('images',None):
            errors['__all__'] = forms.ValidationError('Заполните хотя бы одно поле')
        
        if errors:
            raise forms.ValidationError(errors)

    class Meta:
        model = Post
        fields = ('title','content')

class CommentForm(forms.ModelForm):
    body = forms.CharField(required=False,widget=forms.Textarea(attrs={'class':"lenta-card__comments-add-comment__form-input",'placeholder':'Что вы думаете об этом?','rows':None}))
    images = forms.ImageField(required=False,widget=forms.FileInput(attrs={'multiple':True,'class':'lenta-card__comments-add-comment__form-fileinput'}))

    def clean(self):
        cleaned_data = super().clean()
        errors = {}

        if not cleaned_data.get('body',None) and not cleaned_data.get('images',None):
            errors['__all__'] = forms.ValidationError('Заполните хотя бы одно поле')
        
        if errors:
            raise forms.ValidationError(errors)

    class Meta:
        model = Comment
        fields = ('body',)
