from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models.curriculum import Curriculum


class StudentCurriculumView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = request.user.student
        curriculum = Curriculum.objects.filter(department__department=student.department,year=student.enrollment_date.year).first()
        detail = curriculum.detail.select_related('course').order_by('semester')

        if curriculum:
            detail = curriculum.detail.all()
        curriculum_data = {}

        for curriculum_detail in detail:
            semester = curriculum_detail.semester
            if semester not in curriculum_data:
                curriculum_data[semester] = []

            curriculum_data[semester].append({
                "cours_code": curriculum_detail.course.course_id,
                "course_name": curriculum_detail.course.course_name,
                "course_ects": curriculum_detail.course.ects,
                "course_type": curriculum_detail.get_course_type_display(),
                "course_credit": curriculum_detail.course.credit,
            })

        return Response(curriculum_data)