import uuid

from OutToLunch import event
from django.db import models


# Create your models here.
class CreateEstablishment(event.Event):
    establishment_id = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    location = models.CharField(max_length=100, null=False, blank=False)


class UpdateEstablishment(event.Event):
    establishment_id = models.UUIDField()
    # name =
