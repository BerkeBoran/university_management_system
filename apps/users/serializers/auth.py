from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


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