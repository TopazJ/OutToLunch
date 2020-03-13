from django.db import models
from event.models import Event

name_max_length = 100
location_max_length = 100


class EstablishmentCreatedEvent(Event):
    name = models.CharField(max_length=name_max_length, null=False, blank=False)
    location = models.CharField(max_length=location_max_length, null=False, blank=False)


class EstablishmentUpdatedEvent(Event):
    establishment_id = models.UUIDField(null=False, blank=False)
    name = models.CharField(max_length=name_max_length, null=True, blank=True)
    location = models.CharField(max_length=location_max_length, null=True, blank=True)


class EstablishmentDeletedEvent(Event):
    establishment_id = models.UUIDField(null=False, blank=False)
