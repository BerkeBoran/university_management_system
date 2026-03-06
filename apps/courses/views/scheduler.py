from rest_framework import status, generics
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Course
from apps.users.serializers.courses import InstructorCourseSerializer, CourseSerializer, SectionSerializer
from apps.courses.models import Section
from apps.courses.models import Enrollment
from apps.courses.permission import IsTeacher


class SectionListView(generics.ListAPIView):
    serializer_class = SectionSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            student = user.student
            return Section.objects.filter(
                semester__is_active = True,
                department__department = student.department,
                grade__grade = student.grade,
                is_deleted=False,
            )
        return Section.objects.none()


class AvaliableCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            student = user.student
            return Course.objects.filter(
                sections__semester__is_active = True,
                sections__department__department=student.department,
                sections__grade__grade=student.grade,
                is_deleted=False,
            )

        return Course.objects.none()


class InstructorCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated,IsTeacher]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'instructor'):
            instructor = user.instructor
            return Section.objects.filter(
                instructor = instructor,
                semester__is_active = True,
                department__department = instructor.department,
                is_deleted=False)
        return Section.objects.none()


class InstructorCourseDetailView(generics.RetrieveAPIView):
    serializer_class = InstructorCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'instructor'):
            instructor = user.instructor
            return Section.objects.filter(
                instructor = instructor,
                department__department = instructor.department,
                semester__is_active = True,
                is_deleted = False,
            )
        return Section.objects.none()


class VisualCalendarView(APIView):
    def get(self, request):
        user = self.request.user


        if hasattr(user, 'instructor'):
            instructor = user.instructor
            courses = Course.objects.filter(sections__department__department = instructor.department)


        if hasattr(user, 'student'):
            student = user.student
            courses = Course.objects.filter(sections__department__department = student.department)



        calendar ={
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
        }

        enrollments = Enrollment.objects.filter(student = student).select_related(
            "section__course",
            "section__course_time",
            "section__classroom",
            "section__instructor",


        )
        for enrollment in enrollments:
            section = enrollment.section
            course = section.course
            time_info = section.course_time
            if time_info and time_info.course_days:
                    days_list = [d.strip() for d in time_info.course_days.split(',')]

                    course_data = {
                    "course_name": course.course_name,
                    "course_id": course.course_id,
                    "classroom": section.classroom.classroom_name,
                    "course_start_time": time_info.course_start_time.strftime("%H:%M"),
                    "course_end_time": time_info.course_end_time.strftime("%H:%M"),
                    "course_instructor": f"{section.instructor.first_name} {section.instructor.last_name}",
                }
            for day in days_list:
                if day in calendar:
                    calendar[day].append(course_data.copy())
        return Response(calendar, status = status.HTTP_200_OK)

class CourseDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()
