import json
import uuid

import requests
from django.http import HttpResponse
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    # works to retrive comments
    url = 'https://t5siew2vyb.execute-api.us-east-1.amazonaws.com/alpha/comment'
    # payload = {'commentID': 'null', 'postID': 'testPID1', 'userID': 'null', 'content': 'null', 'dateMS': '0'}
    payload = {'postID': 'testPID1'}
    # payload = {}

    r = requests.get(url, params=payload)
    print(r.text)

    return redirect('/')


def add(request):
    # works
    url = 'https://t5siew2vyb.execute-api.us-east-1.amazonaws.com/alpha/comment'
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
