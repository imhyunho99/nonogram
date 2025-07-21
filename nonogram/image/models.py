# image/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone

import uuid
import os

def upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('origin_images', filename)

class OriginImage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='origin_images'
    )
    image = models.ImageField(upload_to=upload_to)
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"OriginImage {self.id} by {self.user.email}"

class NonogramImage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='nonogram_images'
    )
    origin = models.ForeignKey(
        OriginImage,
        on_delete=models.CASCADE,
        related_name='generated_nonograms'
    )
    size = models.IntegerField()
    image_data = models.TextField()  # base64 encoded black&white or processed image
    generated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Nonogram (size {self.size}) from OriginImage {self.origin.id} by {self.user.email}"

