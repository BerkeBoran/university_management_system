from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.serializers import MyTokenObtainPairSerializer, StudentProfileSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MyProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = StudentProfileSerializer

    def get_object(self):
        return self.request.user