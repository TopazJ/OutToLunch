from django.contrib import admin
from posts import models
# Register your models here.

admin.site.register(models.PostCreatedEvent)
admin.site.register(models.PostUpdatedEvent)
admin.site.register(models.PostDeletedEvent)
