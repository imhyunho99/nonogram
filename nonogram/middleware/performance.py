# backend/nonogram/middleware/performance.py

import time
import logging

logger = logging.getLogger(__name__)


class PerformanceLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.monotonic()
        request_id = request.headers.get('X-Request-ID', 'N/A')

        response = self.get_response(request)

        duration = time.monotonic() - start_time

        logger.info(
            f"[BE Log] Path: {request.path} | Method: {request.method} | "
            f"Status: {response.status_code} | Duration: {duration:.4f}s | "
            f"Request ID: {request_id}"
        )

        return response