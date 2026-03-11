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
        course_id = request.query_params.get('course_id')
        enrollments = Enrollment.objects.filter(section__id=course_id,section__instructor=request.user)

        data = []
        for enrollment in enrollments:
            data.append({
                "enrollment_id": enrollment.id,
                "course_id": f"{enrollment.section.course_id}",
                "student_id": f"{enrollment.student.id}",
                "student_name": f"{enrollment.student.first_name} {enrollment.student.last_name}",
                "midterm_grade": enrollment.midterm_grade,
                "final_grade": enrollment.final_grade,
                "makeup_grade": enrollment.makeup_grade,
                "is_active_makeup_grade": enrollment.is_active_makeup_grade,
                "letter_grade": enrollment.calculate_letter_grade()
            })

        return Response(data)

    def patch(self, request, ):
        student_no = request.data.get('student_no')
        course_id = request.data.get('course_id')
        midterm = request.data.get('midterm_grade')
        final = request.data.get('final_grade')
        makeup = request.data.get('makeup_grade')

        try:
            enrollment = Enrollment.objects.get(section__id=course_id,student__id=student_no,section__instructor=request.user)
        except Enrollment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if midterm is not None:enrollment.midterm_grade = midterm
        if final is not None:enrollment.final_grade = final
        if makeup is not None:enrollment.makeup_grade = makeup

        enrollment.save()

        return Response(status=status.HTTP_201_CREATED)

class StudentGradeView(ListAPIView):
    permission_classes = [IsAuthenticated,IsStudent]
    serializer_class = EnrollCourseSerializer
    def get_queryset(self):
        user = self.request.user
        return Enrollment.objects.filter(student=user)
