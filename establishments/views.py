from django.shortcuts import render

from django.http import HttpResponse


# Create your views here.
def index(request):
    return HttpResponse("Hello establishments")


def create_establishment(request):
    if request.method == 'POST':
        heollo = 0  # josjvsj
        print(heollo)
    return HttpResponse("Hello establishments")


