import uuid
from django.db import models
from .user_verification import generate_activation_key
from django.contrib.auth.models import AbstractUser

# Create your models here.


class SiteUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    elo = models.IntegerField(null=False, default=0)
    image = models.CharField(max_length=2048, default="http://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
    is_confirmed = models.BooleanField(default=False)


class EloTracker(models.Model):
    voter = models.UUIDField(null=False)
    votee = models.UUIDField(null=False)
    post = models.UUIDField(null=False)
    vote = models.IntegerField(null=False)


class Confirmation(models.Model):
    user = models.OneToOneField(SiteUser, on_delete=models.CASCADE, null=False)
    code = models.CharField(primary_key=True, editable=False, default=generate_activation_key, max_length=32)
