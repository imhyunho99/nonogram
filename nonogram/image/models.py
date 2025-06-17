from django.db import models
from django.conf import settings
from django.utils import timezone


class OriginImage(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='origin_images'
    )
    image_data = models.TextField()  # base64 encoded image (color)
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"OriginImage {self.id} uploaded by {self.user.email}"


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

