#!/bin/bash

APP_DIR="/home/ubuntu/nonogram/nonogram"
VENV="/home/ubuntu/nonogram"

cd $APP_DIR

echo "📥 Git pull"
git pull origin main

echo "📦 가상환경 활성화"
source $VENV/bin/activate

echo "📂 Migration & Static"
python manage.py migrate

echo "♻️ 무중단 리로드"
touch  /home/ubuntu/nonogram/reload.txt

echo "🔄 uWSGI, Nginx 재시작 (systemd)"
sudo systemctl restart uwsgi
sudo systemctl restart nginx

echo "✅ 배포 완료"

