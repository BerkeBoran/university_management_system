from django.urls import path
from .views import MyTokenObtainPairView,EnrollCourseView,MyProfileView
from rest_framework_simplejwt.views import TokenRefreshView

from .views.enrollment import TranscriptView
from .views.profiles import ChangePasswordView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('courses/', EnrollCourseView.as_view(), name='enroll_course'),
    path('profile/', MyProfileView.as_view(), name='profile'),
    path('transcript/', TranscriptView.as_view(), name='transcript'),
    path('settings/', ChangePasswordView.as_view(), name='change_password'),
]