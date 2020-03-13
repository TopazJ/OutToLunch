from django.http import JsonResponse
from django.forms.models import model_to_dict


def errorMessage(error_message):
    return JsonResponse({'status': 'error', 'message': error_message})


def successfulMessage(json_data):
    return JsonResponse({**{'status': 'success'}, **json_data})

