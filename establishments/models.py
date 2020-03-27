import uuid
from users.models import SiteUser
from django.db import models
from django.core.exceptions import ValidationError
import json


def validate_less_than_10(value):
    if value > 10:
        raise ValidationError("Invalid rating, should be less than 10!")
    elif value < 0:
        raise ValidationError("Invalid rating, should be greater than 0!")


class Establishment(models.Model):
    establishment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    rating = models.FloatField(default=0, validators=[validate_less_than_10])
    rating_count = models.IntegerField(default=0)
    owner = models.ForeignKey(SiteUser, on_delete=models.DO_NOTHING, null=True)
    image = models.CharField(max_length=2048, null=True)

    def to_json(self, can_edit):
        json_data = {
            'id': self.establishment_id,
            'name': self.name,
            'location': self.location,
            'description': self.description,
            'rating': self.rating,
            'rating_count': self.rating_count,
            'edit': can_edit
        }
        return json_data

    def __str__(self):
        return 'id: %s, name: %s, location: %s, description: %s, rating: %s' % (
            self.establishment_id, self.name, self.location, self.description, self.rating)


class FlagCounter(models.Model):
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    establishment = models.ForeignKey(Establishment, on_delete=models.CASCADE)
