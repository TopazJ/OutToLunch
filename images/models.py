from django.db import models

# Create your models here.
TYPE_CHOICES = [
    ('U', 'User'),
    ('P', 'Post'),
    ('E', 'Establishment'),
]


class Image(models.Model):
    file = models.ImageField(upload_to='images/', null=False)
    type = models.CharField(null=False, max_length=1, choices=TYPE_CHOICES)
    uuid = models.UUIDField(null=False)
