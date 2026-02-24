# apps/courses/urls.py
from django.urls import path
from .views import AvaliableCoursesView, InstructorCourseDetailView, VisualCalendarView

urlpatterns = [
    path('', AvaliableCoursesView.as_view(), name='course-list'),
    path('instructor/course-detail/<int:pk>/', InstructorCourseDetailView.as_view(), name='instructor-course-detail'),
    path('calendar/', VisualCalendarView.as_view(), name='visual_calendar'),
]