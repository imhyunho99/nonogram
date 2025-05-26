from django.urls import path

from .views import JWTDeleteUserView, JWTLoginView, JWTLogoutView, JWTRegisterView, JWTUserDetailView

urlpatterns = [
path("register/", JWTRegisterView.as_view(), name="JWT-register"),
path("login/", JWTLoginView.as_view(), name="JWT-login"),
path("logout/", JWTLogoutView.as_view(), name="JWT-logout"),
path("me/", JWTUserDetailView.as_view(), name="JWT-user-detail"),
path("delete/", JWTDeleteUserView.as_view(), name="JWT-user-delete"),
    ]