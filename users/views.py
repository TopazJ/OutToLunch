from django.shortcuts import render, redirect
import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
# Create your views here.


def status(request):
    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def create_account(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return register_user(data['username'], data['password'])
    else:
        return redirect('/')


def register_user(username, password):
    if not User.objects.filter(username=username).exists():
        user = User.objects.create(username=username)
        user.set_password(password)
        user.save()
        if create_account(username):
            return successful_message({})
    else:
        return error_message("That username already exists!")


def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None:
            response_data = {'status': 'success'}
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
