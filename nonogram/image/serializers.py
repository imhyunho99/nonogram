from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Image
        fields = ['id', 'image_data', 'uploaded_at', 'user_email']
        read_only_fields = ['uploaded_at', 'user_email']
