# apps/courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.courses.views import AvaliableCoursesView, InstructorCourseDetailView, VisualCalendarView,AnswerViewSet,QuestionViewSet
from apps.courses.views.scheduler import CourseDeleteView

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'answers', AnswerViewSet, basename='answers')

urlpatterns = [
    path('', include(router.urls)),
    path('course-list', AvaliableCoursesView.as_view(), name='course-list'),
    path('instructor/course-detail/<int:pk>/', InstructorCourseDetailView.as_view(), name='instructor-course-detail'),
    path('calendar/', VisualCalendarView.as_view(), name='visual_calendar'),
    path('course-delete/<int:pk>/', CourseDeleteView.as_view(), name='CourseDelete'),
]