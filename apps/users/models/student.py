from apps.courses.models.course import Course
from .base import User
from django.db import models
from django.utils import timezone
import secrets
import string

class Student(User):
    enrollment_date = models.DateField(auto_now_add=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    courses = models.ManyToManyField(
        Course,
        related_name="students",
        verbose_name="Kayıtlı Dersler",
        blank=True, )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role=User.Role.STUDENT

            date_str = timezone.now().strftime('%Y%m%d')
            student_count = Student.objects.count()+1
            self.username = f"{date_str}{student_count:02d}"

            alphabet = string.ascii_letters + string.digits
            temp_password = "".join(secrets.choice(alphabet) for i in range(8))
            self.set_password(temp_password)

            print(f"\n" + "=" * 30)
            print(f"YENİ ÖĞRENCİ KAYDI")
            print(f"Kullanıcı Adı: {self.username}")
            print(f"Geçici Şifre:  {temp_password}")
            print("=" * 30 + "\n")

        super().save(*args, **kwargs)

