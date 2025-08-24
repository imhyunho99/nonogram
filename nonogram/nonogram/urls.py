# nonogram/urls.py

from django.urls import path

def trigger_error(request):
    division_by_zero = 1 / 0

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

api_patterns = [
    path('user/', include('user.urls')),
    path('image/', include('image.urls')),
    path('suggestion/', include('suggestion.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
    path('sentry-debug/', trigger_error),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
