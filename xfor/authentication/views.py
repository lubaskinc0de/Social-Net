from django.http import Http404
from django.urls import reverse_lazy
from .forms import UserRegisterForm,UserLoginForm
from django.contrib import messages
from .helpers import send_activation_email,activate_user
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView,TemplateView
from .mixins import NonLoginRequiredMixin

class ActivateUser(NonLoginRequiredMixin,TemplateView):
    authenticated_user_redirect_to = reverse_lazy('home')
    template_name = 'authentication/confirm.html'
    http_method_names = ['get', 'head', 'options', 'trace']

    def get(self, request, *args, **kwargs):
        activation_dict = activate_user(kwargs.get('token'))
        if activation_dict.get('status_code') == 200:
            context = self.get_context_data(user_obj=activation_dict.get('user'),**kwargs)
            return self.render_to_response(context=context)
        else:
            raise Http404(activation_dict.get('message'))
    
    def get_context_data(self,user_obj=None, **kwargs):
        context = super().get_context_data(**kwargs)
        if user_obj:
            context['user_obj'] = user_obj
        return context

class UserRegister(NonLoginRequiredMixin,CreateView):
    authenticated_user_redirect_to = reverse_lazy('home')
    template_name = 'authentication/reg.html'
    form_class = UserRegisterForm
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        self.object = form.save()
        if send_activation_email(request=self.request,user=self.object):
            messages.success(self.request,'Письмо для подтверждения почты отправлено, проверьте почту')
            return super().form_valid(form)
        else:
            self.object.delete()
            return self.form_invalid(form=form,is_email_err=True)
    
    def form_invalid(self, form,is_email_err=False):
        if is_email_err:
            messages.error(self.request,'Ошибка отправки почты! Попробуйте еще раз!')
        return super().form_invalid(form)

class UserLogin(NonLoginRequiredMixin,LoginView):
    authenticated_user_redirect_to = reverse_lazy('home')
    template_name = 'authentication/login.html'
    authentication_form = UserLoginForm
    
    def form_invalid(self, form):
        messages.error(self.request,'Ошибка введенных данных! Либо перед тем как войти необходимо подтвердить почту')
        return super().form_invalid(form)
