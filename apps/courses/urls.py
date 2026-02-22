# apps/courses/urls.py
from django.urls import path
from .views import AvaliableCoursesView, InstructorCourseDetailView

urlpatterns = [
    path('', AvaliableCoursesView.as_view(), name='course-list'),
    path('instructor/course-detail/<int:pk>/', InstructorCourseDetailView.as_view(), name='instructor-course-detail'),
]