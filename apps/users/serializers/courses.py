from rest_framework import serializers

from apps.courses.models import Course


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True)
    semester_name = serializers.CharField(source='semester.semester', read_only=True)
    remaining_capacity = serializers.ReadOnlyField()
    class Meta:
        model = Course
        fields = ['id','course_id','course_name','ects','credit', 'grade', 'course_detail', 'department_name','capacity','semester_name','remaining_capacity',]


class InstructorCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id','capacity','course_name','students']

    def get_fields(self):
        from .users import EnrolledStudentSerializer
        fields = super().get_fields()
        fields['students'] = EnrolledStudentSerializer(many=True, read_only = True)
        return fields