from django.urls import path
from .views import MyTokenObtainPairView,EnrollCourseView,MyProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('enroll/', EnrollCourseView.as_view(), name='enroll_course'),
    path('profile/', MyProfileView.as_view(), name='profile'),
]