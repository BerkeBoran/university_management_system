from rest_framework import generics
from django.shortcuts import render
from apps.courses.models import Course
from apps.users.serializers import CourseSerializer


class AvaliableCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    def get_queryset(self):
        user = self.request.user
        return Course.objects.filter(Department = user.Department, Grade = user.Grade)