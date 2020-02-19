import uuid
from django.db import models


class Event(models.Model):
    event_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=100, null=False, blank=False)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True, null=False)
