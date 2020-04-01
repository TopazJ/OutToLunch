from django.forms import model_to_dict
from django.http import HttpResponse
from django.shortcuts import render, redirect
import json
from establishments.models import *
from establishments.logic import *
from images.models import Image
from users.models import SiteUser
from django.views.decorators.csrf import csrf_exempt


def index(request, page):
    payload = {'data': []}
    page *= 10  # get 10 per page
    establishments = Establishment.objects.all().order_by('-rating')[page:page+10]
    for establishment in establishments:
        can_edit = False
        if request.user.is_authenticated and establishment.owner is request.user:
            can_edit = True
        payload['data'].append(establishment.to_json(can_edit))
    return JsonResponse(payload)


def create(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            content = json.loads(request.POST['content'])
            establishment_uuid = uuid.uuid4()
            image_url = 'https://outtolunchstatic.s3.amazonaws.com/media/images/download.png'
            if 'image' in request.FILES:
                request.FILES['image'].name = uuid.uuid4().__str__()
                image = Image(file=request.FILES['image'], type='E', uuid=establishment_uuid)
                image.save()
                image_url = image.file.url
            if request.user.elo >= 1000:
                establishment = Establishment(establishment_id=establishment_uuid,
                                              name=content['name'],
                                              location=content['location'],
                                              description=content['description'],
                                              rating=0,
                                              owner=request.user,
                                              rating_count=0,
                                              image=image_url)
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
            if FlagCounter.objects.get(establishment=establishment, user=user).exists():
                return JsonResponse({"error": "You've already flagged this establishment!"})
            else:
                if FlagCounter.objects.filter(establishment=establishment).count() == 9:
                    establishment.delete()
                else:
                    flag_count = FlagCounter(establishment=establishment, user=user)
                    flag_count.save()

            return JsonResponse({"success": "success"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def delete(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            instance = Establishment.objects.get(establishment_id=data["establishment_id"], owner=request.user)
            if instance is not None:
                instance.delete()
                return JsonResponse({"success": "success"})
            else:
                return JsonResponse({"error": "You do not have deletion right for this establishment!"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def search(request, search_params):
    payload = {'data': []}
    establishments = Establishment.objects.filter(name__icontains=search_params)
    for establishment in establishments:
        payload['data'].append(establishment.to_json())

    return JsonResponse(payload)
