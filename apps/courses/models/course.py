from django.db import models
from apps.users.models import User
from apps.users.models.instructor import Instructor


class Course(models.Model):
    class Department(models.TextChoices):
        CENG = "CENG"
        MATH = "MATH"
        BIL = "BIL"

    Department = models.CharField(
        choices=Department.choices,
        default=Department.MATH,
        max_length=10)

    course_id = models.CharField(max_length=120, unique=True, verbose_name="Ders Kodu")
    course_name = models.CharField(max_length=100, verbose_name="Ders İsmi")
    course_detail = models.TextField(blank=True, null=True, verbose_name="Dersin İçeriği")
    instructor = models.ForeignKey(
        Instructor, on_delete=models.CASCADE,
        related_name = "courses",
        verbose_name = "Dersin Hocası",
    )
    credit = models.IntegerField(default=3, verbose_name="Ders Kredisi")
    ects = models.IntegerField(default=5, verbose_name="Dersin Akts'si")
    capacity = models.IntegerField(default=50, verbose_name="Dersin Kontenjanı")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_name} - {self.course_id}"