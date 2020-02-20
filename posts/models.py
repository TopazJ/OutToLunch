from django.db import models
from event.models import Event
from posts import post_content_length, post_image_length


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
