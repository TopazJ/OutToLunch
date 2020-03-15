import json
import time
import uuid
from datetime import datetime

import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from event.PynamoDBModels import Comment, Event


def index(request):
    # works to retrive comments
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    payload = {'postID': request.GET['postID']}
    r = requests.get(url, params=payload)
    print(r.text)

    return redirect('/')


def create(request):
    # pynamo db works
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentCreatedEvent', timestamp=datetime.now(),
                    data=Comment(commentID='copy', postID='paste', userID='delete', parentID='test',
                                 content="screech", dateMs=int(time.time() * 1000)))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def delete(request):
    # pynamo db - untested
    # TODO: make it take in the POST information,
    # TODO: validate same user

    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentDeletedEvent', timestamp=datetime.now(),
                    data=Comment(commentID='copy'))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def update(request):
    # pynamo db - untested
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentUpdatedEvent', timestamp=datetime.now(),
                    data=Comment(commentID='copy', content="Jake should see this as an update only"))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})
