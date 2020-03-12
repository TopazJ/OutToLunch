import json
import uuid

import requests
from django.http import HttpResponse
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    # works to retrive comments
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    payload = {'postID': request.GET['postID']}
    # payload = {'postID': 'did'}
    r = requests.get(url, params=payload)
    print(r.text)

    return redirect('/')


def add(request):
    # works
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/readCommentLambda'
    comment_id = uuid.uuid4()
    post_id = uuid.uuid4()
    user_id = uuid.uuid4()
    content = 'test_message from controller'
    parent_id = post_id
    date = 1000000
    payload = {'commentID': str(comment_id), 'postID': str(post_id), 'userID': str(user_id), 'parentID': str(parent_id),
               'content': str(content), 'dateMs': str(date)}
    """
    payload = "\"{\"commentID\":\"" + str(comment_id) + "\", \"postID\":\"" + str(post_id) + "\", \"userID\":\"" + str(
        user_id) + "\", \"parentID\":\"" + str(parent_id) + "\", \"content\":\"" + str(
        content) + "\", \"dateMS\":" + str(date) + '}\"'
    """
    print(payload)
    r = requests.post(url, json=payload)
    print(r.text)

    return redirect('/')
