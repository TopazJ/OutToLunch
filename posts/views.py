import uuid
from datetime import datetime

from django.forms import model_to_dict
from django.shortcuts import render, redirect
import json
import requests
from django.http import HttpResponse, JsonResponse

# Create your views here.
from event.PynamoDBModels import Event, CreatePost
from posts.validation import validate_create_save, validate_update_save, validate_delete_save


def index(request):
    # retrieves posts based on page #
    url = 'https://c8u8796f4d.execute-api.us-west-2.amazonaws.com/alpha/posts'
    payload = {'page': request.GET['page']}
    r = requests.get(url, params=payload)

    # return r
    return redirect('/')


def create(request):
    # pynamo db - untested
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(),
                    type='PostCreatedEvent',
                    timestamp=datetime.now(),
                    data=CreatePost(establishment_id=uuid.uuid4().__str__(),
                                    post_content='bush did 9 11 to defeat the lizard people with holograms',
                                    post_id=uuid.uuid4().__str__(),
                                    post_photo_location='',
                                    post_rating=0, post_subject='the potential truth',
                                    user_id=uuid.uuid4().__str__()
                                    )
                    )
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def delete(request):
    # pynamo db - untested
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(),
                    type='PostDeletedEvent',
                    timestamp=datetime.now(),
                    data=CreatePost(post_id=uuid.uuid4().__str__())
                    )
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def update(request):
    # pynamo db - untested
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(),
                    type='PostUpdatedEvent',
                    timestamp=datetime.now(),
                    data=CreatePost(
                        post_content='bush did not do 9 11',
                        post_id=uuid.uuid4().__str__()
                    )
                    )
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})
