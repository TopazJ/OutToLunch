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
    establishments = Establishment.objects.all().exclude(name='[deleted]').order_by('-rating')[page:page+10]
    for establishment in establishments:
        can_edit = False
        if request.user.is_authenticated and establishment.owner == request.user:
            can_edit = True
        payload['data'].append(establishment.to_json(can_edit))
    return JsonResponse(payload)


def create(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            content = json.loads(request.POST['content'])
            establishment_uuid = uuid.uuid4()
            image_url = 'https://outtolunchstatic.s3.amazonaws.com/media/images/download.png'
            if request.user.elo >= 1000:
                if 'image' in request.FILES:
                    request.FILES['image'].name = uuid.uuid4().__str__()
                    image = Image(file=request.FILES['image'], type='E', uuid=establishment_uuid)
                    image.save()
                    image_url = image.file.url
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
            data = json.loads(request.POST['content'])
            try:
                instance = Establishment.objects.get(establishment_id=data["establishment_id"], owner=request.user)
                if 'image' in request.FILES:
                    request.FILES['image'].name = uuid.uuid4().__str__()
                    try:
                        image = Image.objects.get(uuid=data['establishment_id'], type='E')
                        image.file = request.FILES['image']
                        image.save()
                        data['image'] = image.file.url
                    except Image.DoesNotExist:
                        image = Image(file=request.FILES['image'], type='E', uuid=data['establishment_id'])
                        image.save()
                        data['image'] = image.file.url
                for attr, value in data.items():
                    if attr != 'rating' and attr != 'rating_count':
                        setattr(instance, attr, value)
                instance.full_clean()
                instance.save()
                return JsonResponse({"success": "success"})
            except Establishment.DoesNotExist:
                return JsonResponse({"error": "You do not have editing right for this establishment!"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def flag(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            establishment = Establishment.objects.get(establishment_id=data["establishment_id"])
            try:
                FlagCounter.objects.get(establishment=establishment, user=request.user)
                return JsonResponse({"error": "You've already flagged this establishment!"})
            except FlagCounter.DoesNotExist:
                if FlagCounter.objects.filter(establishment=establishment).count() == 9:
                    establishment.name = '[deleted]'
                    establishment.description = '[deleted]'
                    establishment.location = '[deleted]'
                    establishment.owner = SiteUser.objects.get(id=00000000000000000000000000000000)
                    establishment.save()
                else:
                    flag_count = FlagCounter(establishment=establishment, user=request.user)
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
            try:
                instance = Establishment.objects.get(establishment_id=data["establishment_id"], owner=request.user)
                instance.name = '[deleted]'
                instance.description = '[deleted]'
                instance.location = '[deleted]'
                instance.owner = SiteUser.objects.get(id=00000000000000000000000000000000)
                instance.save()
                return JsonResponse({"success": "success"})
            except Establishment.DoesNotExist:
                return JsonResponse({"error": "You do not have deletion right for this establishment!"})
        else:
            return JsonResponse({"error": "You are not logged in you silly goose!"})
    else:
        return redirect('/')


def search(request, search_params):
    payload = {'data': []}
    establishments = Establishment.objects.filter(name__icontains=search_params).exclude(name='[deleted]')
    for establishment in establishments:
        payload['data'].append(establishment.to_json())
    return JsonResponse(payload)
