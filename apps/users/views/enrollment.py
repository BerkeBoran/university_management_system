from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Course
from apps.core.models.settings import SystemSettings
from apps.courses.permission import IsStudent
from apps.courses.models.section import Section
from apps.courses.models.enrollment import Enrollment

class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated,IsStudent]

    def post(self, request):
        course_id = request.data.get('course_id')
        section_id = request.data.get('section_id')
        student = request.user.student


        try:
            settings = SystemSettings.objects.get(id=1)
            with (transaction.atomic()):
                section = Section.objects.prefetch_related('course','course_time').get(id=section_id)
                course = section.course

                if Enrollment.objects.filter(student = student, section = section_id).exists():
                    return Response({"error": "Bu derse zaten kayıtlısınız."}, status=status.HTTP_400_BAD_REQUEST)

                if not settings or not settings.is_enrollment_open:
                    return Response({"Ders Dönemi Şuan kapalı"}, status=status.HTTP_403_FORBIDDEN)

                if timezone.now() > settings.enrollment_end_date:
                    settings.is_enrollment_open = False
                    settings.save()
                    return Response({"error": "Kayıt süresi doldu."}, status=status.HTTP_403_FORBIDDEN)
                try:
                    if section.remaining_capacity == section.capacity:
                        return Response({"error": "Dersin Kontenjanı dolmuştur."}, status=status.HTTP_403_FORBIDDEN)
                    new_course_time = section.course_time

                    current_courses = student.courses.all()

                    for current_course in current_courses:
                        current_time = current_course.course_time

                        if current_time:
                            if current_time.course_days == new_course_time.course_days:
                                if (current_time.course_start_time < new_course_time.course_end_time) and (
                                        current_time.course_end_time > new_course_time.course_start_time):
                                    return Response({"error": "Saat Çakışması"}, status=status.HTTP_400_BAD_REQUEST)
                    enrollment = Enrollment.objects.create(
                        student=student,
                        section=section,
                        midterm_grade=None,
                        final_grade=None
                    )
                    student.courses.add(section.course)
                    student.save()
                    section.save()
                    return Response({"message": "Derse başarıyla kayıt oldunuz."}, status=status.HTTP_201_CREATED)

                except Course.DoesNotExist:
                    return Response({"error": "Ders bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        except Section.DoesNotExist:
            return Response({"Şube Bulunamadı."}, status=status.HTTP_404_NOT_FOUND)



