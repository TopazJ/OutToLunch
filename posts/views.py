import uuid

from django.forms import model_to_dict
from django.shortcuts import render, redirect
import json
import requests
from django.http import HttpResponse

# Create your views here.
from posts.validation import validate_create_save, validate_update_save, validate_delete_save


def index(request):
    # retrieves posts based on page #
    url = 'https://c8u8796f4d.execute-api.us-west-2.amazonaws.com/alpha/posts'
    payload = {'page': request.GET['page']}
    r = requests.get(url, params=payload)

    #return r
    return redirect('/')


def create_post(request):
    # Needs to be changed to make sure
    """    {
        "type": "PostCreatedEvent",
        "eventId": "MYUNIQUEID",
        "data": {
            "user_id": "nana",
            "post_content": "<blah blah blah>",
            "post_photo_location": null,
            "establishment_id": "someid"
        },
        "timestamp": "<datehere>"
    }"""
    url = 'https://c8u8796f4d.execute-api.us-west-2.amazonaws.com/alpha/posts'
    type = "PostCreatedEvent"
    eventId = uuid.uuid4()
    user_id = uuid.uuid4()
    post_content = "controller test post content"
    photo = None
    establishment = uuid.uuid4()
    data = {
        "user_id": str(user_id),
        "post_content": post_content,
        "post_photo_location": photo,
        "establishment_id": str(establishment),
        "post_rating": 1,
        "post_subject": 'controller test'
    }
    date = 0
    payload = {'type': str(type), 'eventId': str(eventId), 'data': data, 'timestamp': str(date)}
    """
    payload = "\"{\"commentID\":\"" + str(comment_id) + "\", \"postID\":\"" + str(post_id) + "\", \"userID\":\"" + str(
        user_id) + "\", \"parentID\":\"" + str(parent_id) + "\", \"content\":\"" + str(
        content) + "\", \"dateMS\":" + str(date) + '}\"'
    """
    print(payload)
    r = requests.post(url, json=payload)
    print(r.text)

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
