from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.users.serializers.users import StudentProfileSerializer, InstructorProfileSerializer
from apps.users.models import Student, Instructor


class MyProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get(self, request):
        if hasattr(request.user, 'student'):
            student = Student.objects.get(id = request.user.id)
            serializer = StudentProfileSerializer(student)
            return Response(serializer.data)
        if hasattr(request.user, 'instructor'):
            instructor = Instructor.objects.get(id = request.user.id)
            serializer = InstructorProfileSerializer(instructor)
            return Response(serializer.data)

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self,request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Mevcut şifreniz hatalı"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)
        return Response({"message": "Şifre başarılı şekilde güncellendi"}, status=status.HTTP_200_OK)

