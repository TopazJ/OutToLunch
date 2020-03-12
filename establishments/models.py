import uuid
from django.db import models
from django.core.exceptions import ValidationError


def validate_less_than_10(value):
    if value > 10:
        raise ValidationError("Invalid rating, should be less than 10!")
    elif value < 0:
        raise ValidationError("Invalid rating, should be greater than 0!")


class Establishment (models.Model):
    establishment_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    rating = models.IntegerField(default=0, validators=[validate_less_than_10])
    flag_counter = models.IntegerField(default=0)