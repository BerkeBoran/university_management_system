from rest_framework import generics
from django.shortcuts import render
from apps.courses.models import Course
from apps.users.serializers import CourseSerializer


class AvaliableCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            student = user.student
            return Course.objects.filter(
                department__department=student.department,
                grade__grade=student.grade
            )

        return Course.objects.none()