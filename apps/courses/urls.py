# apps/courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.courses.views import AvaliableCoursesView,VisualCalendarView
from apps.courses.views.scheduler import CourseDeleteView, SectionListView, InstructorCourseListView,InstructorCourseViewSet
from apps.courses.views.academic_management import ClassroomViewSet,CourseTimeViewSet,SemesterViewSet,GradeViewSet, DepartmentViewSet
from apps.courses.views.enrollment_grade import EnrollmentGradeView, StudentGradeView
from apps.courses.views.curriculum import StudentCurriculumView
from apps.courses.views.forum import ForumCourseListView,AnswerViewSet,QuestionViewSet


router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='questions')
router.register(r'answers', AnswerViewSet, basename='answers')
router.register(r'classrooms', ClassroomViewSet, basename='classrooms')
router.register(r'course_time', CourseTimeViewSet, basename='course_time')
router.register(r'semester', SemesterViewSet, basename='semester')
router.register(r'grade', GradeViewSet, basename='grade')
router.register(r'department', DepartmentViewSet, basename='department')
router.register(r'instructor-courses', InstructorCourseViewSet, basename='instructor_courses')



urlpatterns = [
    path('course-list-instructor/', InstructorCourseListView.as_view(), name='InstructorCourseList'),
    path('', include(router.urls)),
    path('course-list/', AvaliableCoursesView.as_view(), name='course-list'),
    path('calendar/', VisualCalendarView.as_view(), name='visual_calendar'),
    path('course-delete/<int:pk>/', CourseDeleteView.as_view(), name='CourseDelete'),
    path('enrollment-grade/',EnrollmentGradeView.as_view(), name='enrollment_grade'),
    path('section-list/', SectionListView.as_view(), name='section_list'),
    path('student-grade/',StudentGradeView.as_view(), name='student_grade'),
    path('curriculum/',StudentCurriculumView.as_view(), name='curriculum'),
    path('forum-course-list/', ForumCourseListView.as_view(), name='forum_course_list'),

]