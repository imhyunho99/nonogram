from django.urls import path
from .views import (
    OriginImageListCreateView,
    NonogramImageCreateView,
    NonogramImageListView
)

urlpatterns = [
    path('origin/', OriginImageListCreateView.as_view()),
    path('create/', NonogramImageCreateView.as_view()),
    path('list/', NonogramImageListView.as_view()),
]
