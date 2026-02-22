from rest_framework import generics
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.courses.models import Course
from apps.users.serializers import CourseSerializer, InstructorCourseSerializer


class AvaliableCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            student = user.student
            return Course.objects.filter(
                department__department = student.department,
                grade__grade = student.grade,
                semester__is_active = True,
            )

        return Course.objects.none()

class InstructorCourseDetailView(generics.RetrieveAPIView):
    serializer_class = InstructorCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'instructor'):
            instructor = user.instructor
            return Course.objects.filter(
                instructor = instructor,
                department__department = instructor.department,
                semester__is_active = True,
            )
        return Course.objects.none()
