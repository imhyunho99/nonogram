from django.urls import path
from .views import *

urlpatterns = [
    path('origin/', OriginImageCreateView.as_view()),
    path('create/', NonogramImageCreateView.as_view()),
    path('list/', OriginImageListView.as_view()),
    path('nonogram_list/', NonogramImageListView.as_view()),

]
