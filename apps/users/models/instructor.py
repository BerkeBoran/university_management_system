import secrets
import string
from django.db import models
from django.utils import timezone
from .base import User
from apps.courses.models.course import Department


class Instructor(User):
    department= models.CharField(choices= Department.DepartmentChoices,max_length=50,null=True,blank=True,)
    class Title(models.TextChoices):
        PROFESSOR = "PROF",
        ASSOC_PROF = "ASSOC_PROF"
        ASST_PROF = "ASST_PROF"
        LECTURER = "LECT"
        RESEARCH_ASST = "RA"

    title = models.CharField(
        max_length=10,
        choices=Title.choices,
        default=Title.LECTURER,
        verbose_name="Ünvan"
    )
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = User.Role.INSTRUCTOR
            first_name_clean = self.first_name.lower().replace(" ", "_")
            last_name_clean = self.last_name.lower().replace(" ", "_")
            base_username = f"{first_name_clean} {last_name_clean}"
            base_username = base_username.lower().replace(" ", "_")
            username = base_username
            counter = 1
            while User.objects.filter(username = username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            username = username.lower().replace(" ", "_")
            self.username = username

            alphabet = string.ascii_letters + string.digits
            temp_password = "".join(secrets.choice(alphabet) for i in range(8))
            self.set_password(temp_password)

            print(f"\n" + "=" * 30)
            print(f"YENİ Akademisyen KAYDI")
            print(f"Kullanıcı Adı: {self.username}")
            print(f"Geçici Şifre:  {temp_password}")
            print(f"Ünvan: {self.title}")
            print("=" * 30 + "\n")

        super().save(*args, **kwargs)
