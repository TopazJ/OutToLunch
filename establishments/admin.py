from django.contrib import admin
from establishments import models
# Register your models here.

admin.site.register(models.EstablishmentCreatedEvent)
admin.site.register(models.EstablishmentDeletedEvent)
admin.site.register(models.EstablishmentUpdatedEvent)
