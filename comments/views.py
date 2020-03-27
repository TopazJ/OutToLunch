import json
from json import JSONDecodeError
import time
import uuid
from datetime import datetime
from users.models import SiteUser
import requests
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from event.PynamoDBModels import CreateComment, Event, UpdateComment, WipeComment


def index(request, post_id, page):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    payload = {'parentID': post_id, 'content': '[n:20,offset:'+str(page.__int__()*20)+']'}
    r = requests.get(url, params=payload)
    to_return = {'data': []}
    try:
        for commentData in json.loads(r.json()):
            user = SiteUser.objects.get(id=commentData['userID'])
            commentData['username'] = user.username
            commentData['userImage'] = user.image
            to_return['data'].append(commentData)
    except JSONDecodeError:
        print("Comment data is empty.")
    return JsonResponse(to_return)


def get_comment_count(post_id):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    payload = {'parentID': post_id, 'content': '[count]'}
    r = requests.get(url, params=payload)
    return json.loads(r.json())


def comment_count(request, post_id):
    return JsonResponse({'data': get_comment_count(post_id)})


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

