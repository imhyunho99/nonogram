# Nonogram Generator - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (React SPA)                                       │
│  ├── Home.js (Image Upload & List)                             │
│  ├── Game.js (Nonogram Puzzle Interface)                       │
│  └── Login.js / Register.js (Authentication)                   │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTPS (SSL via Let's Encrypt)
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  Oracle Cloud Free Tier (Ubuntu 22.04)                        │
│  ├── Nginx (Reverse Proxy + Static Files)                     │
│  └── Certbot (SSL Certificate Management)                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                   APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  uWSGI (WSGI Server)                                           │
│  └── systemd (Process Management)                              │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                     BACKEND LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Django + Django REST Framework                                │
│  ├── user/ (JWT Authentication)                                │
│  └── image/ (Image Processing & Puzzle Generation)             │
│      ├── PicControlUtils.py (OpenCV Edge Detection)            │
│      └── GridLogicUtils.py (Nonogram Logic)                    │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                     STORAGE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  File System Storage                                           │
│  ├── media/origin_images/ (Uploaded Images)                    │
│  └── media/nonogram_images/ (Generated Puzzles)                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       CI/CD PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│  GitHub Actions                                                │
│  └── Trigger: main branch push → deploy.sh                     │
└─────────────────────────────────────────────────────────────────┘

## Data Flow

1. User uploads image → React → Django REST API
2. Django processes image with OpenCV → Generates nonogram puzzle
3. User plays puzzle → React UI updates → Completion triggers image reveal
4. JWT tokens handle authentication across all API calls

## Key Technologies

- **Frontend**: React, React Router, Axios
- **Backend**: Python, Django, DRF, OpenCV
- **Infrastructure**: Oracle Cloud, Nginx, uWSGI, systemd
- **Security**: Let's Encrypt SSL, JWT Authentication
- **CI/CD**: GitHub Actions
```
