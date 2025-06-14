from django.urls import path
from .views import SuggestionCreateView, SuggestionDeleteView

urlpatterns = [
    path('create/', SuggestionCreateView.as_view(), name='suggestion-create'),
    path('delete/<int:pk>/', SuggestionDeleteView.as_view(), name='suggestion-delete'),
]
