from rest_framework import serializers

from apps.courses.models import Course
from apps.courses.models.course import Department, Grade
from apps.courses.models.section import Classroom, CourseTime, Semester


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True)
    semester_name = serializers.CharField(source='semester.semester', read_only=True)
    section_id = serializers.IntegerField(read_only=True)
    remaining_capacity = serializers.ReadOnlyField()
    class Meta:
        model = Course
        fields = ['id','course_id','course_name','ects','credit', 'grade', 'course_detail', 'department_name','capacity','semester_name','remaining_capacity','section_id']


class InstructorCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
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


