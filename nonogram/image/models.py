from django.db import models
from django.conf import settings
from django.utils import timezone


class Image(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_data = models.TextField()  # base64 encode
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Image {self.id} uploaded by {self.user.email}"
