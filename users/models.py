import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class SiteUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    elo = models.IntegerField(null=False, default=0)
    image = models.CharField(max_length=2048, default="http://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")


class EloTracker(models.Model):
    voter = models.UUIDField(null=False)
    votee = models.UUIDField(null=False)
    post = models.UUIDField(null=False)
    vote = models.IntegerField(null=False)
