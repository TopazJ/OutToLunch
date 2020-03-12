from django.forms import model_to_dict
from django.shortcuts import render

from django.http import HttpResponse


# Create your views here.
def index(request):
    return HttpResponse("Hello establishments")


def create_establishment(request):
    # need to get views completed to show this.
    # need to determine post vs get
    return HttpResponse("Establishments")
