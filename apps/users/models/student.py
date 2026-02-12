from .base import User
from django.db import models
from django.utils import timezone

class Student(User):

    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role=User.Role.Student

        date_str = timezone.now().strftime('%Y%m%d')
        student_count = Student.objects.count()+1
        self.username = f"{date_str}-{student_count:02d}"

        super().save(*args, **kwargs)