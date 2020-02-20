from django.db import models
from establishments import name_max_length, location_max_length
from event.models import Event


class EstablishmentCreatedEvent(Event):
    name = models.CharField(max_length=name_max_length, null=False, blank=False)
    location = models.CharField(max_length=location_max_length, null=False, blank=False)


class EstablishmentUpdatedEvent(Event):
    establishment_id = models.UUIDField(null=False, blank=False)
    name = models.CharField(max_length=name_max_length, null=True, blank=True)
    location = models.CharField(max_length=location_max_length, null=True, blank=True)


class EstablishmentDeletedEvent(Event):
    establishment_id = models.UUIDField(null=False, blank=False)
