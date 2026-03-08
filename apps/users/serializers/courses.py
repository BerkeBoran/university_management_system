from rest_framework import serializers

from apps.courses.models import Course
from apps.courses.models.section import Classroom, CourseTime, Semester,Department, Grade
from apps.courses.models import Section,Enrollment


class EnrollCourseSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='section.course.course_name', read_only=True)
    course_id = serializers.CharField(source='section.course.course_id', read_only=True)
    credit = serializers.ReadOnlyField(source='section.course.credit')
    akts = serializers.ReadOnlyField(source='section.course.ects')
    midterm = serializers.ReadOnlyField(source='midterm_grade')
    final = serializers.ReadOnlyField(source='final_grade')
    letter = serializers.ReadOnlyField(source='letter_grade')
    makeup = serializers.ReadOnlyField(source='makeup_grade')
    is_active_makeup_grade = serializers.BooleanField(read_only=True)
    class Meta:
        model = Enrollment
        fields = ['id','course_name','course_id','credit','midterm','final','akts','letter','makeup','is_active_makeup_grade']

class SectionSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True,)
    semester = serializers.CharField(source='semester.semester', read_only=True)
    credit = serializers.CharField(source='course.credit', read_only=True)
    grade = serializers.CharField(source='grade.grade', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    course_id = serializers.CharField(source='course.course_id', read_only=True)
    instructor = serializers.CharField(source='instructor.instructor', read_only=True)
    course_days = serializers.CharField(source='course_time.course_days', read_only=True)
    course_start_time = serializers.CharField(source='course_time.course_start_time', read_only=True)
    course_end_time = serializers.CharField(source='course_time.course_end_time', read_only=True)
    class Meta:
        model = Section
        fields = ['id','department_name','semester','credit','grade','course_name','course_id','instructor','course_days','course_start_time','course_end_time','remaining_capacity']

class CourseSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    department_name = serializers.ReadOnlyField(source='sections.first.department.department')
    capacity = serializers.ReadOnlyField(source='sections.first.capacity')
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    class Meta:
        model = Course
        fields = ['id','course_name','course_id','credit','ects','department_name','capacity','sections']


class InstructorCourseSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    students = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Section
        fields = ['id','capacity','course_name','students']

    def get_students(self, obj):
        from apps.users.serializers import EnrolledStudentSerializer
        enrollments = obj.enrollments.all()
        students = [enrollment.student for enrollment in enrollments]
        return EnrolledStudentSerializer(students, many=True, read_only = True).data

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


