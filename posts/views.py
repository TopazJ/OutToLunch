import uuid
from datetime import datetime

from django.forms import model_to_dict
from django.shortcuts import render, redirect
import json
import requests
from django.http import HttpResponse, JsonResponse

# Create your views here.
from event.PynamoDBModels import Event, Post
from posts.validation import validate_create_save, validate_update_save, validate_delete_save


def index(request):
    # retrieves posts based on page #
    url = 'https://c8u8796f4d.execute-api.us-west-2.amazonaws.com/alpha/posts'
    page = 'page'
    if request.GET.get(page):
        payload = {page: request.GET[page]}
    else:
        payload = {page: 0}
    r = requests.get(url, params=payload)
    print(r.text)
    # return r
    return redirect('/')


def create(request):
    # pynamo db - untested
    # TODO: make it take in the POST information

    """ post_id = UnicodeAttribute()
    post_user = UnicodeAttribute()
    post_date = UnicodeAttribute()
    post_rating = NumberAttribute()
    post_subject = UnicodeAttribute()
    post_content = UnicodeAttribute()
    post_photo_location = UnicodeAttribute()
    establishment_id = UnicodeAttribute()"""
    comment = Event(event_id=uuid.uuid4().__str__(),
                    type='PostCreatedEvent',
                    timestamp=datetime.now(),
                    data=Post(post_id=uuid.uuid4().__str__(),
                              establishment_id=uuid.uuid4().__str__(),
                              user_id="testID",
                              post_content='test_post',

                              post_photo_location='',
                              post_rating=0, post_subject='the potential truth',

                              )
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
                    data=Post(
                        post_date="2020-03-21 22:49",
                        post_id="1e4d4de2-6bc6-11ea-a989-0ac9002d85a0"
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
                    data=Post(post_id="1e4d4de2-6bc6-11ea-a989-0ac9002d85a0")
                    )
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})
