from django.template.context_processors import request
from rest_framework import status
from rest_framework.generics import get_object_or_404, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.courses.models.enrollment import Enrollment
from apps.courses.permission import IsTeacher,IsStudent
from apps.users.serializers.courses import EnrollCourseSerializer

class EnrollmentGradeView(APIView):
    permission_classes = [IsAuthenticated,IsTeacher]

    def get(self, request):
            enrollment = Enrollment.objects.get()
            return Response({
                "course_id": f"{enrollment.section.course_id}",
                "student_id": f"{enrollment.student.id}",
                "student_name": f"{enrollment.student.first_name} {enrollment.student.last_name}",
                "midterm_grade": f"{enrollment.midterm_grade}",
                "final_grade": f"{enrollment.final_grade}"

            })

    def patch(self, request, ):
        course_id = request.data.get('course_id')
        student_id = request.data.get('enrollment_grade_id')
        midterm = request.data.get('midterm_grade')
        final = request.data.get('final_grade')

        try:
            enrollment = Enrollment.objects.get(student_id=student_id, section__course__id=course_id)
        except Enrollment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        enrollment.midterm_grade = midterm
        enrollment.final_grade = final

        enrollment.save()

        return Response(status=status.HTTP_201_CREATED)

class StudentGradeView(ListAPIView):
    permission_classes = [IsAuthenticated,IsStudent]
    serializer_class = EnrollCourseSerializer
    def get_queryset(self):
        user = self.request.user
        return Enrollment.objects.filter(student=user)
