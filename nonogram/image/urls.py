from django.urls import path
from .views import (
    OriginImageListCreateView,
    NonogramImageCreateView,
    NonogramImageListView
)

urlpatterns = [
    path('origin/', OriginImageListCreateView.as_view()),
    path('nonogram/create/', NonogramImageCreateView.as_view()),
    path('nonogram/list/', NonogramImageListView.as_view()),
]
