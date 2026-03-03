from django.utils import timezone
from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError


class Department(models.Model):
    CENG = "CENG"
    MATH = "MATH"
    SWE = "SWE"
    DepartmentChoices = (
        (CENG, "CENG"),
        (MATH, "MATH"),
        (SWE, "SWE"),
    )
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    department = models.TextField(choices = DepartmentChoices)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.department}"

class Grade(models.Model):
    FRESHMAN = 1
    SOPHOMORE = 2
    JUNIOR = 3
    SENIOR = 4

    GradeChoices = (
        (FRESHMAN, "Freshman"),
        (SOPHOMORE, "Sophomore"),
        (JUNIOR, "Junior"),
        (SENIOR, "Senior"),
    )
    is_deleted = models.BooleanField(default = False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    grade = models.IntegerField(choices = GradeChoices)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.grade}"

class Course(models.Model):
    course_id = models.CharField(max_length = 120, unique = True, verbose_name = "Ders Kodu")
    course_name = models.CharField(max_length = 100, verbose_name = "Ders İsmi")
    course_detail = models.TextField(blank = True, null = True, verbose_name = "Dersin İçeriği")
    credit = models.IntegerField(default = 3, verbose_name = "Ders Kredisi")
    ects = models.IntegerField(default = 5, verbose_name = "Dersin Akts'si")
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    is_deleted = models.BooleanField(default = False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    department = models.ForeignKey(Department,on_delete=models.CASCADE,null=True,blank=True,related_name = "courses")
    grade = models.ForeignKey(Grade,on_delete=models.CASCADE,null=True,blank=True,related_name = "courses")


    def __str__(self):
        return f"{self.course_name} - {self.course_id}"

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()


    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


