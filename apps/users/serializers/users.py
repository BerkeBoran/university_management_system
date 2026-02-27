from rest_framework import serializers
from apps.users.serializers.courses import CourseSerializer
from apps.users.models import Instructor,Student


class StudentProfileSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Student
        fields = ['id','username','first_name','last_name','gpa','courses',]


class InstructorProfileSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Instructor
        fields = ['id','username','first_name','last_name','courses','department','title']


class EnrolledStudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = Student
        fields = ['id','username','full_name']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"