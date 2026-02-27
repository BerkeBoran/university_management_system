from apps.courses.models.course import Course, Department, Grade
from .base import User
from django.db import models
from django.utils import timezone
import secrets
import string

class Student(User):
    enrollment_date = models.DateField(auto_now_add=True)
    gpa = models.DecimalField(max_digits = 3, decimal_places = 2, default = 0)
    department = models.CharField(max_length = 120, choices = Department.DepartmentChoices)
    grade = models.IntegerField(default = 1, choices = Grade.GradeChoices)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    courses = models.ManyToManyField(
        Course,
        related_name="students",
        verbose_name="Kayıtlı Dersler",
        blank=True, )

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

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

