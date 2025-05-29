from django.urls import path

from .views import DeleteUserView, LoginView, LogoutView, RegisterView, UserDetailView

urlpatterns = [
path("register/", RegisterView.as_view(), name="register"),
path("login/", LoginView.as_view(), name="login"),
path("logout/", LogoutView.as_view(), name="logout"),
path("me/", UserDetailView.as_view(), name="user-detail"),
path("delete/", DeleteUserView.as_view(), name="user-delete"),
    ]