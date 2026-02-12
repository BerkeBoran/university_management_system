from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import Instructor

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['full_name'] = f"{user.first_name} {user.last_name}"

        if hasattr(user, 'Instructor'):
            token['title'] = user.Instructor.get_title_display()



        return token

    def validate(self, attrs):

        data = super().validate(attrs)

        data['username'] = self.user.username
        data['full_name'] = f"{self.user.first_name} {self.user.last_name}"
        data['role'] = self.user.role
        if hasattr(self.user, 'Instructor'):
            data['title'] = self.user.Instructor.get_title_display()
        else:
            data['title'] = None

        return data
