from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from apps.courses.models.section import Classroom, CourseTime, Semester,Department, Grade
from apps.users.serializers.courses import ClassroomSerializer, CourseTimeSerializer, SemesterSerializer,DepartmentSerializer,GradeSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.filter(is_deleted=False)
    serializer_class = ClassroomSerializer
    permission_classes = [IsAdminUser]

class CourseTimeViewSet(viewsets.ModelViewSet):
    queryset = CourseTime.objects.filter(is_deleted=False)
    serializer_class = CourseTimeSerializer
    permission_classes = [IsAdminUser]

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAdminUser]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.filter(is_deleted=False)
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]

class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.filter(is_deleted=False)
    serializer_class = GradeSerializer
    permission_classes = [IsAdminUser]