from rest_framework import generics, status, viewsets
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.courses.models import Course
from apps.users.serializers import CourseSerializer, InstructorCourseSerializer, QuestionSerializer, AnswerSerializer
from apps.courses.models.forum import Question,Answer
from apps.courses.permission import IsTeacherOrQuestionAuthor


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


class VisualCalendarView(APIView):
    def get(self, request):
        user = self.request.user


        if hasattr(user, 'instructor'):
            instructor = user.instructor
            courses = Course.objects.filter(department__department = instructor.department)


        if hasattr(user, 'student'):
            student = user.student
            courses = Course.objects.filter(department__department = student.department)



        calendar ={
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
        }
        for course in courses:
            time_info = course.course_time
            if time_info and time_info.course_days:
                    days_list = [d.strip() for d in time_info.course_days.split(',')]
                    course_data = {
                    "course_name": course.course_name,
                    "course_id": course.course_id,
                    "classroom": course.classroom.classroom_name,
                    "course_start_time": time_info.course_start_time.strftime("%H:%M"),
                    "course_end_time": time_info.course_end_time.strftime("%H:%M"),
                    "course_instructor": f"{course.instructor.title} {course.instructor.first_name} {course.instructor.last_name}",
                }
            for day in days_list:
                if day in calendar:
                    calendar[day].append(course_data.copy())
        return Response(calendar, status = status.HTTP_200_OK)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]


    def get_permissions(self):
        if self.action in ['update', 'partial_update','destroy']:
            return [IsTeacherOrQuestionAuthor()]
        return [IsAuthenticated()]
    def perform_create(self, serializer):
        serializer.save(author = self.request.user)

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return self.queryset.filter(course_id = course_id)
        return self.queryset

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)