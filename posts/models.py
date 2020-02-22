from django.db import models
from event.models import Event

post_content_length = 5000
post_image_length = 10000


class PostCreatedEvent(Event):
    user_id = models.UUIDField(null=False, blank=False)
    post_content = models.CharField(max_length=post_content_length, null=False, blank=False)
    post_photo_location = models.CharField(max_length=post_image_length, null=True, blank=True)


class PostUpdatedEvent(Event):
    post_id = models.UUIDField(null=False, blank=False)
    user_id = models.UUIDField(null=True, blank=True)
    post_content = models.CharField(max_length=post_content_length, null=True, blank=True)
    post_photo_location = models.CharField(max_length=post_image_length, null=True, blank=True)


class PostDeletedEvent(Event):
    post_id = models.UUIDField(null=False, blank=False)
