from django.urls import path, re_path
from .views import loginPage, enterPage, createNewAccountPage, getUsername, getUsernameAndPassword


urlpatterns = [
    re_path(r'^login/?$', loginPage, name='login'),
    re_path(r'^login/enter/?$', enterPage, name='enter'),
    re_path(r'^login/enter/getUsernameAndPassword/?$', getUsernameAndPassword, name='getUsernameAndPassword'),
    re_path(r'^login/createNewAccount/?$', createNewAccountPage, name='createNewAccount'),
    re_path(r'^login/getUsername/?$', getUsername, name='getUsername'),
]