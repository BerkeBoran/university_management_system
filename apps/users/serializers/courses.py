from rest_framework import serializers

from apps.courses.models import Course
from apps.courses.models.section import Classroom, CourseTime, Semester,Department, Grade
from apps.courses.models import Section


class SectionSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True,)
    semester = serializers.CharField(source='semester.semester', read_only=True)
    credit = serializers.CharField(source='course.credit', read_only=True)
    grade = serializers.CharField(source='grade.grade', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    course_id = serializers.CharField(source='course.course_id', read_only=True)
    class Meta:
        model = Section
        fields = ['id','department_name','semester','credit','grade','course_name','course_id']

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='sections.first.department.department')
    capacity = serializers.ReadOnlyField(source='sections.first.capacity')
    class Meta:
        model = Course
        fields = ['id','course_name','course_id','credit','ects','department_name','capacity']


class InstructorCourseSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    students = serializers.CharField(source='student.student', read_only=True)
    class Meta:
        model = Section
        fields = ['id','capacity','course_name','students']

    def get_fields(self):
        from .users import EnrolledStudentSerializer
        fields = super().get_fields()
        fields['students'] = EnrolledStudentSerializer(many=True, read_only = True)
        return fields

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classroom
        fields = ['id','classroom_name','classroom_capacity']

class CourseTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseTime
        fields = '__all__'

class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id','semester', 'is_active','year']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','department']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id','grade']


