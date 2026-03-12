from django.utils import timezone
from rest_framework import status
from rest_framework.generics import get_object_or_404, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.courses.models.enrollment import Enrollment
from apps.courses.permission import IsTeacher,IsStudent
from apps.users.serializers.courses import EnrollCourseSerializer
from apps.core.models import SystemSettings

class EnrollmentGradeView(APIView):
    permission_classes = [IsAuthenticated,IsTeacher]

    def get(self, request):
        course_id = request.query_params.get('course_id')
        enrollments = Enrollment.objects.filter(section__id=course_id,section__instructor=request.user)
        settings = SystemSettings.get_settings()
        now = timezone.now()
        is_midterm_open = (
            settings.is_midterm_open and
            settings.midterm_start_date and
            settings.midterm_end_date and
            settings.midterm_start_date <= now <= settings.midterm_end_date
        )
        is_final_open = (
            settings.is_final_open and
            settings.final_start_date and
            settings.final_end_date and
            settings.final_start_date <= now <= settings.final_end_date
        )
        is_makeup_open = (
            settings.is_makeup_open and
            settings.makeup_start_date and
            settings.makeup_end_date and
            settings.makeup_start_date <= now <= settings.makeup_end_date
        )

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
                "is_active_midterm_enroll_grade": is_midterm_open,
                "is_active_final_enroll_grade": is_final_open,
                "is_active_makeup_enroll_grade": is_makeup_open,
                "letter_grade": enrollment.calculate_letter_grade()
            })

        return Response(data)

    def patch(self, request, ):
        student_no = request.data.get('student_no')
        course_id = request.data.get('course_id')
        midterm = request.data.get('midterm_grade')
        final = request.data.get('final_grade')
        makeup = request.data.get('makeup_grade')
        now = timezone.now()

        try:
            settings = SystemSettings.objects.get(id=1)
            enrollment = Enrollment.objects.get(section__id=course_id,student__id=student_no,section__instructor=request.user)
        except Enrollment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if midterm is not None:
            if (settings.is_midterm_open and
                    settings.midterm_start_date <= now <= settings.midterm_end_date):
                enrollment.midterm_grade = midterm
            else:
                return Response(
                    {"error": "Vize giriş süresi doldu veya henüz başlamadı."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if final is not None:
            if (settings.is_final_open and
                settings.final_start_date <= now <= settings.final_end_date):
                enrollment.final_grade = final
            else:
                return Response(
                    {"error": "Final giriş süresi doldu veya henüz başlamadı."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        if makeup is not None:
            if (settings.is_makeup_open and
                settings.makeup_start_date <= now <= settings.makeup_end_date):
                enrollment.makeup_grade = makeup
            else:
                return Response(
                    {"error": "Bütünleme giriş süresi doldu veya henüz başlamadı."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        enrollment.save()

        return Response(status=status.HTTP_201_CREATED)

class StudentGradeView(ListAPIView):
    permission_classes = [IsAuthenticated,IsStudent]
    serializer_class = EnrollCourseSerializer
    def get_queryset(self):
        user = self.request.user
        return Enrollment.objects.filter(student=user)
