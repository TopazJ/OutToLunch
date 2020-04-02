from datetime import datetime
from establishments.models import *
from users.models import *
from images.models import Image
from comments.views import get_comment_count
from django.shortcuts import redirect
import json
import requests
from django.http import JsonResponse

# Create your views here.
from event.PynamoDBModels import *
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
    return JsonResponse(compile_data(r.json(), establishment_id=establishment_id))


def user_posts(request, user_id, page):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/user'
    payload = {"page": page.__int__(), "post_user": user_id}
    r = requests.get(url, params=payload)
    return JsonResponse(compile_data(r.json(), user_id=user_id))


def post_details(request, post_id):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/'
    r = requests.get(url+str(post_id))
    return JsonResponse(compile_data(r.json()))


def search(request, search_params, page):
    url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/search'
    payload = {"page": page.__int__(), "search_criteria": search_params}
    r = requests.get(url, params=payload)
    return JsonResponse({"data": r.json()})


def compile_data(post_data_list, user_id=0, establishment_id=0):
    to_return = {'data': []}
    if user_id != 0:
        user = SiteUser.objects.get(id=user_id)
        to_return['username'] = user.username
    if establishment_id != 0:
        establishment = Establishment.objects.get(establishment_id=establishment_id)
        to_return['name'] = establishment.name
        to_return['rating_count'] = establishment.rating_count
    for post_data in post_data_list:
        post_data['count'] = get_comment_count(post_data['post_id'])['count']
        if user_id == 0:
            user = SiteUser.objects.get(id=post_data['user_id'])
        if establishment_id == 0:
            establishment = Establishment.objects.get(establishment_id=post_data['establishment_id'])
        post_data['username'] = user.username
        post_data['user_image'] = user.image
        post_data['establishment_name'] = establishment.name
        to_return['data'].append(post_data)
    return to_return


def create(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            content = json.loads(request.POST['content'])
            post_id = uuid.uuid4().__str__()
            image_url = 'https://outtolunchstatic.s3.amazonaws.com/media/images/download.png'
            if 'image' in request.FILES:
                request.FILES['image'].name = uuid.uuid4().__str__()
                image = Image(file=request.FILES['image'], type='P', uuid=post_id)
                image.save()
                image_url = image.file.url
            post_event = Event(event_id=uuid.uuid4().__str__(),
                               type='PostCreatedEvent',
                               timestamp=datetime.now(),
                               data=Post(post_id=post_id,
                                         post_user=content['userId'],
                                         post_rating=content['rating'],
                                         post_subject=content['subject'],
                                         establishment_id=content['establishmentId'],
                                         post_content=content['content'],
                                         post_photo_location=image_url
                                         )
                               )
            post_event.save()
            establishment = Establishment.objects.get(establishment_id=content['establishmentId'])
            establishment.rating_count += 1
            establishment.rating = ((establishment.rating * (establishment.rating_count - 1)) + content['rating']) / establishment.rating_count
            establishment.save()
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to post!'})
    else:
        return redirect('/')


def update(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.POST['content'])
            if validate_post(data["post_id"], request.user.id):
                if 'image' in request.FILES:
                    request.FILES['image'].name = uuid.uuid4().__str__()
                    try:
                        image = Image.objects.get(uuid=data['post_id'], type='P')
                        image.file = request.FILES['image']
                        image.save()
                        data['post_photo_location'] = image.file.url
                    except Image.DoesNotExist:
                        image = Image(file=request.FILES['image'], type='P', uuid=data['post_id'])
                        image.save()
                        data['post_photo_location'] = image.file.url
                instance = Post(post_id=data["post_id"])
                for attr, value in data.items():
                    setattr(instance, attr, value)
                post_update_event = Event(event_id=uuid.uuid4().__str__(),
                                          type=PostUpdatedEvent,
                                          timestamp=datetime.now(),
                                          data=instance
                                          )
                post_update_event.save()
                if 'post_rating' in data.keys():
                    establishment = Establishment.objects.get(establishment_id=data['establishment_id'])
                    establishment.rating = ((establishment.rating * establishment.rating_count) - data['oldRating'] + data['post_rating'])/establishment.rating_count
                    print(establishment.rating)
                    establishment.save()
                return JsonResponse({'success': 'success'})
            else:
                return JsonResponse({'error': "You don't have permissions to modify this post!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to modify this post!'})
    else:
        return redirect('/')


def vote(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            url = 'https://i7hv4g41ze.execute-api.us-west-2.amazonaws.com/alpha/posts/validate/'
            r = requests.get(url + str(data['postId']))
            user = SiteUser.objects.get(id=r.json()['user_id'])
            try:
                elo = EloTracker.objects.get(voter=data['userId'], votee=r.json()['user_id'], post=data['postId'])
                if elo.vote != data['vote']:
                    user.elo += data['vote']
                    user.save()
                    elo.vote = data['vote']
                    elo.save()
                    create_post_vote(data['postId'], data['userId'], data['vote'])
                else:
                    return JsonResponse({'error': 'You already voted for this post!'})
            except EloTracker.DoesNotExist:
                elo = EloTracker(voter=data['userId'], votee=r.json()['user_id'], post=data['postId'], vote=data['vote'])
                elo.save()
                user.elo += data['vote']
                user.save()
                create_post_vote(data['postId'], data['userId'], data['vote'])
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'You have to login first in order to modify this post!'})
    else:
        return redirect('/')


def create_post_vote(post_id, user_id, vote_result):
    instance = PostVote(post_id=post_id, user_id=user_id, vote=vote_result)
    vote_event = Event(event_id=uuid.uuid4().__str__(),
                       type=PostVoteEvent,
                       timestamp=datetime.now(),
                       data=instance
                       )
    vote_event.save()


def delete(request):
    # TODO Need to modify micro-service so that deleted posts become owned by the deleted user and ratings become 0.
    if request.method == "POST":
        if request.user.is_authenticated:
            data = json.loads(request.body)
            if validate_post(data["post_id"], request.user.id):
                post_delete_event = Event(event_id=uuid.uuid4().__str__(),
                                          type=PostDeletedEvent,
                                          timestamp=datetime.now(),
                                          data=Post(post_id=data["post_id"], post_user=data["post_user"], establishment_id=data["establishment_id"])
                                          )
                post_delete_event.save()
                try:
                    image = Image.objects.get(uuid=data['post_id'], type='P')
                    image.delete()
                except Image.DoesNotExist:
                    print("No image to delete!")
                establishment = Establishment.objects.get(establishment_id=data['establishment_id'])
                establishment.rating_count -= 1
                divider = 1
                if establishment.rating_count > 0:
                    divider = establishment.rating_count
                establishment.rating = ((establishment.rating * (establishment.rating_count + 1)) - data['rating']) / divider
                establishment.save()
                return JsonResponse({'success': 'success'})
            else:
                return JsonResponse({'error': "You don't have permissions to delete this post!"})
        else:
            return JsonResponse({'error': 'You have to login first in order to delete this post!'})
    else:
        return redirect('/')
