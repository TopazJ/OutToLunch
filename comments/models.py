from django.db import models
from event.models import Event

CONTENT_LENGTH = 10000


class CommentCreatedEvent(Event):
    user_id = models.UUIDField(null=False, blank=False)
    post_id = models.UUIDField(null=False, blank=False)
    parent_id = models.UUIDField(null=True, blank=True)
    content = models.CharField(max_length=CONTENT_LENGTH, null=False, blank=False)


class CommentUpdatedEvent(Event):
    comment_id = models.UUIDField(null=False, blank=False)
    user_id = models.UUIDField(null=True, blank=True)
    post_id = models.UUIDField(null=True, blank=True)
    parent_id = models.UUIDField(null=True, blank=True)
    content = models.CharField(max_length=CONTENT_LENGTH, null=True, blank=True)


class CommentDeletedEvent(Event):
    comment_id = models.UUIDField(null=False, blank=False)
