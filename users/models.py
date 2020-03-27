import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class SiteUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    elo = models.IntegerField(null=False, default=0)
    image = models.ImageField(upload_to='profile-images/', default="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
