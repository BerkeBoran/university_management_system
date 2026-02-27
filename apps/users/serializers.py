from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import Instructor

from apps.courses.models.course import Course
from apps.courses.models.forum import Question, Answer
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
        if self.user.role == 'Instructor':
            data['title'] = self.user.instructor.get_title_display()
        else:
            data['title'] = None

        return data


class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department', read_only=True)
    semester_name = serializers.CharField(source='semester.semester', read_only=True)
    remaining_capacity = serializers.ReadOnlyField()
    class Meta:
        model = Course
        fields = ['id','course_id','course_name','ects','credit', 'grade', 'course_detail', 'department_name','capacity','semester_name','remaining_capacity',]


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


class InstructorCourseSerializer(serializers.ModelSerializer):
    students = EnrolledStudentSerializer(many = True, read_only = True)

    class Meta:
        model = Course
        fields = ['id','capacity','course_name','students']


class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Answer
        fields = ['id','question','created_at','updated_at','author_name','upvotes','author','is_accepted','answer_text',]
        read_only_fields = ['author_name','upvotes','is_accepted','author']


class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(many=True, read_only=True)
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Question
        fields =  ['id','created_at','updated_at','question_title','author','author_name','course','is_resolved','question_text','answer']
        read_only_fields = ['author']

    def validate(self, attrs):
        if attrs.get('is_accepted'):
            question = self.instance.question if self.instance else attrs['question']
            Answer.objects.filter(question=question).update(is_accepted=False)
            question.is_resolved = True
            question.save()
        return attrs

