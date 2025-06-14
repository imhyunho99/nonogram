from rest_framework import generics, permissions
from .models import Suggestion
from .serializers import SuggestionSerializer
from .permissions import IsOwnerOrAdmin


class SuggestionCreateView(generics.CreateAPIView):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SuggestionDeleteView(generics.DestroyAPIView):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
