# Nonogram Generator

Nonogram Generator는 사용자가 업로드한 이미지를 기반으로 퍼즐을 생성하는 웹 서비스입니다.  
그리드 사이즈를 설정하면 해당 이미지로부터 네모로직 퍼즐이 생성되며,  
React 기반 UI를 통해 게임처럼 직접 플레이할 수 있습니다.

Django REST Framework 백엔드와 React 프론트엔드로 구성되며, Oracle Cloud 에서 배포 중입니다.

## 데모

https://nonogram.duckdns.org/

---

## 기술 스택

### Backend
- Python
- Django
- Django REST Framework
- OpenCV (이미지 처리: Edge Detection)

### Frontend
- React
- React Router
- Axios

### 배포 및 인프라
- Oracle Cloud Free Tier (Ubuntu 22.04)
- Nginx + uWSGI
- systemd (uWSGI 프로세스 관리)
- Certbot (Let's Encrypt SSL)

### CI/CD
- GitHub Actions
  - Trigger: main 브랜치 push
  - `deploy.sh`를 통해 자동 배포

---

## 주요 기능

- ✅ 사용자 회원가입 및 로그인 (JWT 기반 인증)
- ✅ 이미지 업로드 및 업로드 목록 조회
- ✅ 이미지 선택 후 네모로직 퍼즐 생성
- ✅ 완성 시 원본 이미지 페이드인 효과
- ✅ React 기반 동적 라우팅

---

## 프로젝트 구조

```bash
nonogram/
├── nonogram/
│   ├── nonogram/             # Django 설정 및 루트 URL
│   ├── image/                # 이미지 및 퍼즐 관련 앱
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── utils/
│   │       ├── PicControlUtils.py
│   │       └── GridLogicUtils.py
│   └── user/                 # 사용자 인증/관리
│       ├── views.py
│       └── serializers.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Game.js
│   │   │   └── Login.js / Register.js
│   │   └── api/
│   │       └── axiosConfig.js
│   └── public/
│       └── index.html
│
├── media/
│   ├── origin_images/        # 업로드된 원본 이미지
│   └── nonogram_images/      # 생성된 퍼즐 이미지
│
├── uwsgi.ini                 # uWSGI 설정
├── deploy.sh                 # 자동 배포 스크립트
└── ...
