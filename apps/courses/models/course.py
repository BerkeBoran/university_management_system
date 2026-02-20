from django.db import models

class Department(models.Model):
    CENG = "CENG"
    MATH = "MATH"
    DepartmentChoices = (
        (CENG, "CENG"),
        (MATH, "MATH"),
    )
    department = models.TextField(choices = DepartmentChoices)
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
    grade = models.IntegerField(choices = GradeChoices)
    def __str__(self):
        return f"{self.grade}"

class Course(models.Model):
    course_id = models.CharField(max_length = 120, unique = True, verbose_name = "Ders Kodu")
    course_name = models.CharField(max_length = 100, verbose_name = "Ders İsmi")
    course_detail = models.TextField(blank = True, null = True, verbose_name = "Dersin İçeriği")
    instructor = models.ForeignKey('users.Instructor', on_delete = models.CASCADE, related_name = "courses",verbose_name = "Dersin Hocası",null = True,blank = True)
    credit = models.IntegerField(default = 3, verbose_name = "Ders Kredisi")
    ects = models.IntegerField(default = 5, verbose_name = "Dersin Akts'si")
    capacity = models.IntegerField(default = 50, verbose_name = "Dersin Kontenjanı")
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    department = models.ForeignKey(Department,on_delete=models.CASCADE,null=True,
        blank=True,related_name = "courses")
    grade = models.ForeignKey(Grade,on_delete=models.CASCADE,null=True,
        blank=True,related_name = "courses")

    def __str__(self):
        return f"{self.course_name} - {self.course_id}"