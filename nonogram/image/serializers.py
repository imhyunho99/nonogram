# image/serializers.py

from rest_framework import serializers
from .models import OriginImage

class OriginImageSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = OriginImage
        fields = ['id', 'image', 'uploaded_at', 'user_email']
        read_only_fields = ['uploaded_at', 'user_email']


class NonogramImageSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    origin_id = serializers.IntegerField(source='origin.id', read_only=True)

    class Meta:
        model = NonogramImage
        fields = ['id', 'origin_id', 'size', 'image_data', 'generated_at', 'user_email']
        read_only_fields = ['generated_at', 'user_email', 'origin_id']
