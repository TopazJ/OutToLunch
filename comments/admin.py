from django.contrib import admin
from comments import models
# Register your models here.

admin.site.register(models.CommentCreatedEvent)
admin.site.register(models.CommentDeletedEvent)
admin.site.register(models.CommentUpdatedEvent)