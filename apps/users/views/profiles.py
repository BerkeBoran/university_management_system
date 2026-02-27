from rest_framework import generics, permissions
from rest_framework.response import Response

from apps.users.serializers.users import StudentProfileSerializer, InstructorProfileSerializer
from apps.users.models import Student, Instructor


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

