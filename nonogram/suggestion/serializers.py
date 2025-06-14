from rest_framework import serializers
from .models import Suggestion


class SuggestionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Suggestion
        fields = ['id', 'title', 'message', 'created_at', 'user_email']
        read_only_fields = ['created_at', 'user_email']
