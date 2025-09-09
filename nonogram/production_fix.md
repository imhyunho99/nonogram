# Production Server Fix Required

## Issue
The production server at `nonogram.duckdns.org` is returning 400 errors because it doesn't have the environment variables set up.

## Fix Steps (Run on production server)

1. **Create .env file on production server:**
```bash
cd /home/ubuntu/nonogram/nonogram
cat > .env << EOF
SECRET_KEY=django-insecure-z^xdhi5n#!(i!8p(kiuo*6dr$*bku&^hk!zp!r&sn4nm^4^_c9
DEBUG=False
SENTRY_DSN="https://d2e4b5a5b14fa6ca1b6d8544c96732a7@o4509881158205440.ingest.de.sentry.io/4509881167970384"
EOF
```

2. **Restart uWSGI service:**
```bash
sudo systemctl restart uwsgi
# or if using different service name:
sudo systemctl restart nonogram
```

3. **Check service status:**
```bash
sudo systemctl status uwsgi
```

## Alternative Quick Fix
If you can't access the production server immediately, the current code has fallback values that should work.

## Security Note
After fixing the production deployment, generate a new SECRET_KEY for production use.
