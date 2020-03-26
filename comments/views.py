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
    payload = {'ParentID': data['parentID']}
    r = requests.get(url, params=payload)
    return JsonResponse(r.json())

def create(request):
    # pynamo db - tested
    # TODO: make it take in the POST information
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            comment = Event(event_id=uuid.uuid4().__str__(),
                            type='CommentCreatedEvent',
                            timestamp=datetime.now(),
                            data=CreateComment(commentID=uuid.uuid4().__str__(),
                                               userID=data["userID"],
                                               parentID=data['parentID'],
                                               content=data['content'],
                                               dateMs=int(time.time() * 1000)))
            comment.save()
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')



def update(request):
    # pynamo db - untested
    # TODO: make it take in the POST information
    # TODO: validate same user
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            comment = Event(event_id=uuid.uuid4().__str__(),
                            type='CommentUpdatedEvent',
                            timestamp=datetime.now(),
                            data=UpdateComment(commentID=data['comentID'],
                                               userID=data['userID'],
                                               parentID=data['parentID'],
                                               content=data['content'],
                                               dateMs=data['dateMS'],
                                               numChildren=0
                                               ))
            comment.save()
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')



def delete(request):
    # pynamo db - tested
    # TODO: make it take in the POST information,
    # TODO: validate same user
    # usage
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            comment = Event(event_id=uuid.uuid4().__str__(),
                            type='CommentWipedEvent',
                            timestamp=datetime.now(),
                            data=WipeComment(commentID=data['commentID'],
                                             userID=data['userID'],
                                             parentID=data['parentID'],
                                             content=data['content'],
                                             dateMs=data['dateMS'],
                                             numChildren=0
                                             ))
            comment.save()
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')

