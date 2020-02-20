from django.shortcuts import render

from django.http import HttpResponse


# Create your views here.
def index(request):
    return HttpResponse("Hello establishments")


def create_establishment(request):
    try:
        if request.method == 'POST':
            print(request.body)
            return HttpResponse("Added a new establishment")

    except:
        return HttpResponse("Something went wrong")
