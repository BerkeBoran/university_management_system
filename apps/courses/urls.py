# apps/courses/urls.py
from django.urls import path
from .views import AvaliableCoursesView

urlpatterns = [
    path('', AvaliableCoursesView.as_view(), name='course-list'),
]