from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Profile


def loginPage(request):
  return render(
    request,
    'accounts/templates/logo.html'
  )


def enterPage(request):
  return render(
    request,
    'accounts/templates/enter.html'
  )


def createNewAccountPage(request):
  isEditing = request.GET.get('editing', False)

  if request.method == 'POST':
    isEditing = request.GET.get('editing', False)

    if not isEditing:
      username = request.POST.get('username')
      fullname = request.POST.get('fullname')
      phoneNumber = request.POST.get('phone')
      password = request.POST.get('password')
      
      user = User.objects.create_user(username=username, password=password)
      profile = Profile(user=user, fullname=fullname, phoneNumber=phoneNumber)
      profile.save()

      messages.success(request, 'Аккаунт успешно создан!')
      return render(
        request,
        'accounts/templates/enter.html',
      )

    else:
      initialUsername = request.POST.get('initialUsername')
      username = request.POST.get('username')
      fullname = request.POST.get('fullname')
      phoneNumber = request.POST.get('phone')

      user = get_object_or_404(User, username=initialUsername)
      profile = get_object_or_404(Profile, user=user)

      updated = False

      if user.username != username:
        user.username = username
        user.save()
        updated = True

      if fullname != profile.fullname or phoneNumber != profile.phoneNumber:
        profile.fullname = fullname
        profile.phoneNumber = phoneNumber
        profile.save()
        updated = True

      if updated:
        messages.success(request, 'Данные успешно изменены!')
      else:
        messages.error(request, 'Данные не были изменены.')

      return render(
        request,
        'accounts/templates/createNewAccount.html',
        context={
          'username': profile.user.username,
          'fullname': profile.fullname,
          'phoneNumber': profile.phoneNumber,
          'isEditing': True,
        }
      )

  if isEditing == "True":
    try:
      profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
      return render(request, 'accounts/templates/createNewAccount.html', {'username': None})

    return render(
      request,
      'accounts/templates/createNewAccount.html',
      {
        'username': profile.user.username,
        'fullname': profile.fullname,
        'phoneNumber': profile.phoneNumber,
        'isEditing': True,
      }
    )

  return render(
    request,
    'accounts/templates/createNewAccount.html', 
    context={
      'username': None
    }
  )


def getUsername(request):
  if request.method == "GET":
    username = request.GET.get('username', None)
    
    if username:
        exists = User.objects.filter(username=username).exists()
        return JsonResponse({'exists': exists})
    return JsonResponse({'exists': False})
  

def getUsernameAndPassword(request):
  if request.method == "GET":
    username = request.GET.get('username', None)
    password = request.GET.get('password', None)

    if username and password:
      user = authenticate(username=username, password=password)
      
      if user is None:
        if User.objects.filter(username=username).exists():
          return JsonResponse({'exists': False, 'error': 'Неверный пароль.'})
        else:
          return JsonResponse({'exists': False, 'error': 'Имя пользователя не существует.'})
      else:
        login(request, user)
        return JsonResponse({'exists': True})
    else:
      return JsonResponse({'exists': False, 'error': 'Имя пользователя и пароль не должны быть пустыми.'})