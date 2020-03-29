from django.shortcuts import render, redirect
import json
from datetime import datetime
from .models import *
from event.PynamoDBModels import *
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
        data = json.loads(request.body)
        return register_user(data['username'], data['password'], data['email'], data['FName'], data['LName'])
    else:
        return redirect('/')


def register_user(username, password, email, f_name, l_name):
    if not SiteUser.objects.filter(username=username).exists():
        user = SiteUser.objects.create(username=username, email=email, first_name=f_name, last_name=l_name)
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
