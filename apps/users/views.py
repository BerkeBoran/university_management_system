from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.serializers import MyTokenObtainPairSerializer, StudentProfileSerializer, InstructorProfileSerializer
from apps.courses.models import Course
from apps.users.models import Student
from apps.users.models import Instructor


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get(self, request):
        if hasattr(request.user, 'student'):
            student = Student.objects.prefetch_related('courses').get(id = request.user.id)
            serializer = StudentProfileSerializer(student)
        if hasattr(request.user, 'instructor'):
            instructor = Instructor.objects.prefetch_related('courses').get(id = request.user.id)
            serializer = InstructorProfileSerializer(instructor)
        return Response(serializer.data)


class EnrollCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get('course_id')
        user = request.user

        if not hasattr(user, 'student'):
            return Response({"error": "Sadece öğrenci hesabı ile ders seçimi yapılabilir."},
                            status=status.HTTP_403_FORBIDDEN)

        student = user.student
        try:
            course = Course.objects.get(id = course_id)
            if course.department.department != student.department:
                return Response({"error": "Bu ders sizin bölümünüze uygun değil."}, status = status.HTTP_403_FORBIDDEN)

            if course.grade.grade != student.grade:
                return Response({"error": "Bu ders sizin sınıfınıza uygun değil."}, status = status.HTTP_403_FORBIDDEN)

            if student.courses.filter(id=course.id).exists():
                return Response({"error": "Bu derse zaten kayıtlısınız."}, status=status.HTTP_400_BAD_REQUEST)

            student.courses.add(course)
            return Response({"message": "Derse başarıyla kayıt oldunuz."}, status=status.HTTP_201_CREATED)

        except Course.DoesNotExist:
            return Response({"error": "Ders bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
