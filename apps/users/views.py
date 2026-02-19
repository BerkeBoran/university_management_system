from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.serializers import MyTokenObtainPairSerializer, StudentProfileSerializer
from apps.courses.models import Course


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return self.request.user


class EnrollCourseView(APIView):
    def post(self, request):
        course_id = request.data.get('course_id')
        student = request.user

        try:
            course = Course.objects.get(id = course_id)
            if course.Department != student.Department or course.Grade != student.Grade:
                return Response({"error": "Bu ders sizin sınıfınıza/bölümünüze uygun değil."}, status = status.HTTP_403_FORBIDDEN)

            student.Course.add(course)
            return Response({"message": "Derse başarıyla kayıt oldunuz."}, status=status.HTTP_201_CREATED)

        except Course.DoesNotExist:
            return Response({"error": "Ders bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
