import json
import time
import uuid
from datetime import datetime

import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from event.PynamoDBModels import CreateComment, Event, UpdateComment, WipeComment


def index(request):
    # works to retrive comments (post ID only) - deprecated
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    data = json.loads(request.body)
    payload = {'parentID': data['parentID']}
    r = requests.get(url, params=payload)
    #TODO This results in a string. Needs to be changed to JSON format.
    return JsonResponse({"data": r.text})


def create(request):
    # pynamo db - tested
    # TODO: make it take in the POST information

    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentCreatedEvent', timestamp=datetime.now(),
                    data=CreateComment(commentID='copy', userID='delete', parentID='test',
                                       content="screech", dateMs=int(time.time() * 1000)))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def update(request):
    # pynamo db - untested
    # TODO: make it take in the POST information
    # TODO: validate same user

    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentUpdatedEvent', timestamp=datetime.now(),
                    data=UpdateComment(commentID="16056ff1-6bde-11ea-a989-0ac9002d85a0",
                                       userID='mohamedID',
                                       parentID='yeet',
                                       content="Victor loves feet",
                                       dateMs=0,
                                       numChildren=0
                                       ))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})


def delete(request):
    # pynamo db - tested
    # TODO: make it take in the POST information,
    # TODO: validate same user
    # usage
    comment = Event(event_id=uuid.uuid4().__str__(), type='CommentWipedEvent', timestamp=datetime.now(),
                    data=WipeComment(commentID="copy",
                                     userID='wipe',
                                     parentID='null',
                                     content="wipe",
                                     dateMs=0,
                                     numChildren=0
                                     ))
    comment.save()

    if request.user.is_authenticated:
        return JsonResponse({'status': 'user'})
    else:
        return JsonResponse({'status': 'anon'})
