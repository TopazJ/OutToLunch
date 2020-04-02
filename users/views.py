from django.shortcuts import render, redirect
import json
from datetime import datetime
from .models import *
from images.models import Image
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout


# Create your views here.


def status(request):
    if request.user.is_authenticated:
        return JsonResponse({'status': 'user',
                             'user': {'elo': request.user.elo,
                                      'id': request.user.id,
                                      'image': request.user.image,
                                      'username': request.user.username}})
    else:
        return JsonResponse({'status': 'anon'})


def create_account(request):
    if request.method == 'POST':
        content = json.loads(request.POST['content'])
        user_id = uuid.uuid4()
        image_url = 'https://outtolunchstatic.s3.amazonaws.com/media/images/download.png'
        if 'image' in request.FILES:
            request.FILES['image'].name = uuid.uuid4().__str__()
            image = Image(file=request.FILES['image'], type='U', uuid=user_id)
            image.save()
            image_url = image.file.url
        return register_user(user_id, content['username'], content['password'], content['email'], content['FName'], content['LName'], image_url)
    else:
        return redirect('/')


def update(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            if 'image' in request.FILES:
                request.FILES['image'].name = uuid.uuid4().__str__()
                try:
                    image = Image.objects.get(uuid=request.user.id, type='U')
                    image.file = request.FILES['image']
                    image.save()
                    request.user.image = image.file.url
                    request.user.save()
                except Image.DoesNotExist:
                    request.FILES['image'].name = uuid.uuid4().__str__()
                    image = Image(file=request.FILES['image'], type='U', uuid=request.user.id)
                    image.save()
                    request.user.image = image.file.url
                    request.user.save()
                return successful_message({})
            else:
                return error_message("No image provided!")
        else:
            return error_message("You must be signed in!")
    else:
        return redirect('/')


def register_user(user_id, username, password, email, f_name, l_name, image):
    if not SiteUser.objects.filter(username=username).exists():
        user = SiteUser.objects.create(id=user_id, username=username, email=email, first_name=f_name, last_name=l_name, image=image)
        user.set_password(password)
        user.save()
        return successful_message({})
    else:
        return error_message("That username already exists!")


def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None:
            response_data = {'status': 'success',
                             'user': {'elo': user.elo,
                                      'id': user.id,
                                      'image': user.image,
                                      'username': user.username}}
            if user.is_active:
                login(request, user)
        else:
            response_data = {'status': "Couldn't log you in, account might not exist!"}

        return JsonResponse(response_data)
    else:
        return redirect('/')


def logout_user(request):
    logout(request)
    return successful_message({})


def error_message(message):
    return JsonResponse({'status': 'error', 'message': message})


def successful_message(json_data):
    return JsonResponse({**{'status': 'success'}, **json_data})


def validate_user(user_id):
    if SiteUser.objects.filter(id=user_id) is None:
        return False
    else:
        return True
