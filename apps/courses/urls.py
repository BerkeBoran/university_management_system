# apps/courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.courses.views import AvaliableCoursesView, InstructorCourseDetailView, VisualCalendarView,AnswerViewSet,QuestionViewSet
from apps.courses.views.scheduler import CourseDeleteView
from apps.courses.views.academic_management import ClassroomViewSet,CourseTimeViewSet,SemesterViewSet,GradeViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'answers', AnswerViewSet, basename='answers')
router.register(r'classrooms', ClassroomViewSet, basename='classrooms')
router.register(r'course_time', CourseTimeViewSet, basename='course_time')
router.register(r'semester', SemesterViewSet, basename='semester')
router.register(r'grade', GradeViewSet, basename='grade')
router.register(r'department', DepartmentViewSet, basename='department')



urlpatterns = [
    path('', include(router.urls)),
    path('course-list', AvaliableCoursesView.as_view(), name='course-list'),
    path('instructor/course-detail/<int:pk>/', InstructorCourseDetailView.as_view(), name='instructor-course-detail'),
    path('calendar/', VisualCalendarView.as_view(), name='visual_calendar'),
    path('course-delete/<int:pk>/', CourseDeleteView.as_view(), name='CourseDelete'),
]