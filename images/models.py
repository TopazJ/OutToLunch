from django.db import models

# Create your models here.


class Image(models.Model):
    file = models.ImageField(upload_to='images/', null=False)
    uuid = models.UUIDField(null=False)
