from django.forms import model_to_dict
from django.shortcuts import render, redirect
import json
import requests
from django.http import HttpResponse

# Create your views here.
from posts.validation import validate_create_save, validate_update_save, validate_delete_save


def index(request):
    url = 'https://c8u8796f4d.execute-api.us-west-2.amazonaws.com/alpha/posts'
    payload = {'page': '0'}

    r = requests.get(url, params=payload)
    print(r.text)

    return redirect('/')


def create_post(request):
    if request.method == 'POST':

        data = json.loads(request.body)

        return validate_create_save(user_id=data['user_id'],
                                    post_content=data['post_content'],
                                    post_photo_location=data['post_photo_location']
                                    )
    else:
        return redirect('/')


def update_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return validate_update_save(post_id=data['post_id'],
                                    user_id=data['user_id'],
                                    post_content=data['post_content'],
                                    post_photo_location=data['post_photo_location']
                                    )
    else:
        return redirect('/')


def delete_post(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return validate_delete_save(post_id=data['post_id'],
                                    user_id=data['user_id'],
                                    )
    else:
        return redirect('/')
