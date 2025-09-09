# Critical Security Fixes Required

## 1. Environment Configuration
```python
# settings.py - Use environment variables
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
```

## 2. Database Security
```bash
# Fix database permissions
chmod 600 db.sqlite3
```

## 3. Production Settings
```python
# Add to settings.py
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

## 4. File Upload Limits
```python
# Add to settings.py
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
```

## 5. CORS Fix
```python
# Fix duplicate CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://nonogram.duckdns.org",
    "http://localhost:3000",  # Only for development
]
```
