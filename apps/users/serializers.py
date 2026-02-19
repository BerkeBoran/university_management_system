from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import Instructor

from apps.courses.models.course import Course
from .models.student import Student
from rest_framework import serializers

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['full_name'] = f"{user.first_name} {user.last_name}"

        if hasattr(user.role, 'INSTRUCTOR'):
            token['title'] = user.instructor.get_title_display()



        return token

    def validate(self, attrs):
        request = self.context.get('request')
        requested_role = request.data.get('role') if request else None

        data = super().validate(attrs)

        if requested_role:
            if self.user.role.upper() != requested_role.upper():
                from rest_framework.exceptions import PermissionDenied

                raise PermissionDenied({
                    "code": "invalid_role",
                    "detail": "Seçtiğiniz rol ile hesabınız eşleşmiyor!"
                })
        data['username'] = self.user.username
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}"
        data['role'] = self.user.role
        if self.user.role == 'instructor':
            data['title'] = self.user.instructor.get_title_display()
        else:
            data['title'] = None

        return data



class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True)
    class Meta:
        model = Course
        fields = ['id','course_id','course_name','ects','credit', 'grade', 'course_detail', 'department_name']

class StudentProfileSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    class Meta:
        model = Student
        fields = ['id','username','first_name','last_name','gpa','courses',]