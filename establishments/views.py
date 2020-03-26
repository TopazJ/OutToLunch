from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render, redirect
import json
from establishments.models import Establishment
from establishments.logic import *
from django.views.decorators.csrf import csrf_exempt


def index(request):
    payload = {'data': {}}
    if request.GET.get('establishment_id'):
        establishment = Establishment.objects.get(request.GET['establishment_id'])
        payload['data'][0] = establishment.to_json()
    else:
        # get the 10 first ones
        establishments = Establishment.objects.all().order_by('-rating')[0:10]

        for i in range(len(establishments)):
            payload['data'][i] = establishments[i].to_json()
        print(payload)
    return JsonResponse(payload)


def create(request):
    establishment = Establishment(name="Bakechef's shifty testing cousin",
                                  location="UofC",
                                  description="Strange and ephemereal version of bakechef",
                                  rating=3)
    establishment.save()
    return redirect('/')

def delete(request):
    if request.GET.get("establishment_id"):
        Establishment.objects.get(establishment_id=request.GET["establishment_id"]).delete()
    return redirect('/')


def update(request):
    establishment = Establishment.objects.get(establishment_id="c1c2572c-3bf9-460f-8cb3-9678aadc56a6")
    establishment.location = "University of Calgary"
    establishment.save()
    return redirect('/')

def search(request):
    payload = {'data': {}}
    establishments = Establishment.objects.get(name__contains=request.GET.get("search"));
    for i in range(len(establishments)):
        payload['data'][i] = establishments[i].to_json()

    return JsonResponse(payload)