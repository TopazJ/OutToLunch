import requests
from django.http import HttpResponse
from django.shortcuts import render, redirect


# Create your views here.
def index(request):
    url = 'https://t5siew2vyb.execute-api.us-east-1.amazonaws.com/alpha/comment'
    payload = {'commentID': 'null', 'postID': 'testPID1', 'userID': 'null', 'content': 'null', 'dateMS': '0'}

    r = requests.get(url, params=payload)
    print(r.text)

    return redirect('/')
