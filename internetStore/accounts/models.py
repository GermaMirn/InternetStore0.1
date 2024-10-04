from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fullname = models.CharField(max_length=200)
    phoneNumber = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username