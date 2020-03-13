from django.forms import model_to_dict
from django.shortcuts import render, redirect
import json
from .models import Establishment
from .logic import *
from django.views.decorators.csrf import csrf_exempt

def index (request):
    redirect('/')


@csrf_exempt
def get_one_establishment(request):
    if request.method == 'GET':
        data = json.load(request.body)
        establishment_list = Establishment.objects.get()
        if establishment_list is not None:
            print ("got here")
            response_data = establishment_list.get().to_json()
            return successfulMessage(response_data)
        else:
            redirect('/')


# def buy_trade(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         transaction = buy_trade_transaction_creation(request.user.get_username(), symbol=data['stock'],
#                                                      quantity=data['quantity'])
#         if transaction is not None:
#             response_data = model_to_dict(transaction)
#             # response_data = serializers.serialize('json', [transaction])
#             return successfulMessage(response_data)
#         else:
#             return errorMessage("Unable to create transaction")


# Create your views here.


# def index(request):
#     return HttpResponse("Hello establishments")
#
#
# def create_establishment(request):
#     # need to get views completed to show this.
#     # need to determine post vs get
#     return HttpResponse("Establishments")
