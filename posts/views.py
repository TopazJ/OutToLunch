import uuid
from datetime import datetime
from establishments.models import *
from comments.views import get_comment_count
from django.forms import model_to_dict
from django.shortcuts import redirect
import json
import requests
from django.http import HttpResponse, JsonResponse

# Create your views here.
from event.PynamoDBModels import Event, Post
from posts.validation import *


def index(request, page):
    # retrieves posts based on page #
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts'
    payload = {"page": page.__int__()}
    r = requests.get(url, params=payload)
    return JsonResponse(compile_data(r.json()))


def establishment_posts(request, establishment_id, page):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/establishment'
    payload = {"page": page.__int__(), "establishment_id": establishment_id}
    r = requests.get(url, params=payload)
    return JsonResponse(compile_data(r.json()))


def user_posts(request, user_id, page):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/user'
    payload = {"page": page.__int__(), "post_user": user_id}
    r = requests.get(url, params=payload)
    return JsonResponse(compile_data(r.json(), user_id))


def post_details(request, post_id):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/'
    r = requests.get(url+str(post_id))
    return JsonResponse(compile_data(r.json()))


def compile_data(post_data_list, user_id=0):
    to_return = {'data': []}
    if user_id != 0:
        user = SiteUser.objects.get(id=user_id)
        to_return['username'] = user.username
    for post_data in post_data_list:
        post_data['count'] = get_comment_count(post_data['post_id'])['count']
        if user_id == 0:
            user = SiteUser.objects.get(id=post_data['user_id'])
        post_data['username'] = user.username
        post_data['user_image'] = user.image
        post_data['establishment_name'] = Establishment.objects.get(establishment_id=post_data['establishment_id']).name
        to_return['data'].append(post_data)
    return to_return


def create(request):
    # pynamo db - tested
    # TODO: picture boi
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            comment = Event(event_id=uuid.uuid4().__str__(),
                            type='PostCreatedEvent',
                            timestamp=datetime.now(),
                            data=Post(post_id=uuid.uuid4().__str__(),
                                      user_id=data['user_id'],
                                      post_rating=data['rating'],
                                      post_subject=data['post_subject'],
                                      establishment_id=data['establishment_id'],
                                      post_content=data['post_content'],
                                      post_photo_location='null'
                                      )
                            )
            comment.save()
            establishment = Establishment.objects.get(establishment_id=data['establishment_id'])
            establishment.rating_count += 1
            establishment.rating = ((establishment.rating * (establishment.rating_count - 1)) + data['rating'])/ establishment.rating_count
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')


def update(request):
    # pynamo db - tested
    # TODO: validation
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if validate_post(data["post_id"], request.user.id):
                instance = Post(post_id= data["post_id"])
                for attr, value in data["data"].items():
                        setattr(instance, attr, value)
                comment = Event(event_id=uuid.uuid4().__str__(),
                                type='PostUpdatedEvent',
                                timestamp=datetime.now(),
                                data=instance
                                )
                comment.save()
                return JsonResponse({'success': 'success'})
            else:
                return JsonResponse({'error': "You don't have permissions to modify this post!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to modify this post!'})
    else:
        return redirect('/')


def delete(request):
    # pynamo db - tested
    #TODO: validation

    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if validate_post(data["post_id"], request.user.id):
                comment = Event(event_id=uuid.uuid4().__str__(),
                                type='PostDeletedEvent',
                                timestamp=datetime.now(),
                                data=Post(post_id=data["post_id"])
                                )
                comment.save()
                return JsonResponse({'success': 'success'})
            else:
                return JsonResponse({'error': "You don't have permissions to delete this post!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to delete this post!'})
    else:
        return redirect('/')
