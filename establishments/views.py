from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render, redirect
import json
from establishments.models import *
from establishments.logic import *
from users.models import SiteUser
from django.views.decorators.csrf import csrf_exempt


def index(request):
    payload = {'data': []}
    data = json.loads(request.body)
    page = data['page']
    page *= 10
    # get the 10 first ones
    establishments = Establishment.objects.all().order_by('-rating')[page:page+10]
    for establishment in establishments:
        canedit = False
        if request.user.is_authenticated and establishment.owner is request.user:
             canedit = True
        payload['data'].append(establishment.to_json(canedit))
    print(payload)
    return JsonResponse(payload)


def create(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if request.user.elo >= 1000:
                establishment = Establishment(name=data['name'],
                                              location= data['location'],
                                              description=data['description'],
                                              rating=0,
                                              owner=request.user,
                                              rating_count=0)
                establishment.save()
                return JsonResponse({"success": "success"})
            else:
                return JsonResponse({"error": "You do not have enough elo!"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def update(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            instance = Establishment.objects.get(establishment_id=data["establishment_id"], owner=request.user)
            if instance is not None:
                for attr, value in data["data"].items():
                    if attr != 'rating' and attr != 'rating_count':
                        setattr(instance, attr, value)
                instance.full_clean()
                instance.save()
                return JsonResponse({"success": "success"})
            else:
                return JsonResponse({"error": "You do not have editing right for this establishment!"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def flag(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            user = SiteUser.objects.get(id=request.user.id)
            establishment = Establishment.objects.get(establishment_id=data["establishment_id"])
            if Flag_counter.objects.get(establishment = establishment, user=user).exists():
                return JsonResponse({"error": "You've already flagged this establishment!"})
            else:
                if Flag_counter.objects.filter(establishment = establishment).count() is 9:
                    establishment.delete()
                else:
                    flag_count = Flag_counter(establishment=establishment, user=user)
                    flag_count.save()

            return JsonResponse({"success": "success"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def search(request):
    payload = {'data': []}
    data = json.loads(request.body)
    establishments = Establishment.objects.filter(name__contains=data['search']);
    for establishment in establishments:
        payload['data'].append(establishment.to_json())

    return JsonResponse(payload)
