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
    payload = {'parentID': post_id, 'content': '[n:20,offset:' + str(page.__int__() * 20) + ']'}
    r = requests.get(url, params=payload)
    to_return = {'data': []}
    try:
        if r.json() == {'message': 'Internal server error'}:
            to_return['message'] = 'error'
            return JsonResponse(to_return)
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
    if r.json() == {'message': 'Internal server error'}:
        return json.loads('{"count": "ERROR"}')
    return json.loads(r.json())


def comment_count(request, post_id):
    return JsonResponse({'data': get_comment_count(post_id)})


def create(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            comment_id = uuid.uuid4().__str__()
            comment = Event(event_id=uuid.uuid4().__str__(),
                            type='CommentCreatedEvent',
                            timestamp=datetime.now(),
                            data=CreateComment(commentID=comment_id,
                                               userID=data["userID"],
                                               parentID=data['parentID'],
                                               content=data['content'],
                                               dateMs=int(time.time() * 1000)))
            comment.save()
            return JsonResponse({'success': 'success', 'commentId': comment_id})
        else:
            return JsonResponse({'error': 'You have to login first in order to post a comment!'})
    else:
        return redirect('/')


def validate_comment(comment_id, user_id):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    payload = {'commentID': comment_id}
    r = requests.get(url, params=payload)
    if r.json() == {'message': 'Internal server error'}:
        return 'E'  # error
    valid_user_id = json.loads(r.json())[0]['userID'].__str__().replace('-', '')
    sent_user_id = user_id.__str__().replace('-', '')
    if valid_user_id == sent_user_id:
        return 'V'  # valid
    return 'I'  # invalid


def update(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            validation = validate_comment(data['commentID'], request.user.id)
            if validation == 'V':
                comment = Event(event_id=uuid.uuid4().__str__(),
                                type='CommentUpdatedEvent',
                                timestamp=datetime.now(),
                                data=UpdateComment(commentID=data['commentID'],
                                                   userID=data['userID'],
                                                   content=data['content'],
                                                   numChildren=data['numChildren']
                                                   ))
                comment.save()
                return JsonResponse({'success': 'success'})
            elif validation == 'I':
                return JsonResponse({'error': "You don't have permission to modify this comment!"})
            else:
                return JsonResponse({'error': "Please try again later!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to edit a comment!'})
    else:
        return redirect('/')


def delete(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if validate_comment(data['commentID'], request.user.id):
                comment = Event(event_id=uuid.uuid4().__str__(),
                                type='CommentWipedEvent',
                                timestamp=datetime.now(),
                                data=WipeComment(commentID=data['commentID'],
                                                 userID=00000000000000000000000000000000,
                                                 content='wipe',
                                                 )
                                )
                comment.save()
                return JsonResponse({'success': 'success'})
            elif validation == 'I':
                return JsonResponse({'error': "You don't have permission to modify this comment!"})
            else:
                return JsonResponse({'error': "Please try again later!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')
