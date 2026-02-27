from django.utils import timezone
from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError

class CourseTime(models.Model):
    Days = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
    ]
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    course_days = models.TextField(max_length=100, choices = Days)
    course_start_time = models.TimeField(blank = True, null = True,)
    course_end_time = models.TimeField(blank = True, null = True,)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.course_days} - {self.course_start_time} - {self.course_end_time}"

class Classroom(models.Model):
    classroom_name = models.CharField(max_length = 100)
    classroom_capacity = models.PositiveIntegerField()
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.classroom_name}"

class Semester(models.Model):
    year = models.IntegerField(default=2026)
    is_active = models.BooleanField(default = False, verbose_name = "Semester Status")
    Spring = "Spring"
    Autumn = "Autumn"
    Semester_Choices = (
        (Spring, "Spring"),
        (Autumn, "Autumn"),
    )
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    semester = models.TextField(choices = Semester_Choices)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def save(self, *args, **kwargs):
        if self.is_active:
            Semester.objects.filter(is_active = True).update(is_active = False)
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year} - {self.get_semester_display()}"

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
    capacity = models.IntegerField(default = 50, verbose_name = "Dersin Kontenjanı")
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    is_deleted = models.BooleanField(default = False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    course_time = models.ForeignKey(CourseTime,on_delete=models.CASCADE,null = True,blank = True,related_name = "courses")
    classroom = models.ForeignKey(Classroom, on_delete = models.CASCADE, null = True, blank = True, related_name = "courses")
    instructor = models.ForeignKey('users.Instructor', on_delete = models.CASCADE, related_name = "courses",verbose_name = "Dersin Hocası",null = True,blank = True)
    department = models.ForeignKey(Department,on_delete=models.CASCADE,null=True,blank=True,related_name = "courses")
    grade = models.ForeignKey(Grade,on_delete=models.CASCADE,null=True,blank=True,related_name = "courses")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE,null=True,)

    @property
    def remaining_capacity(self):
        enrolled_count = self.students.count()
        return max(0, enrolled_count)
    def __str__(self):
        return f"{self.course_name} - {self.course_id}"

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def clean(self):
        if not self.classroom and not self.course_time:
            return


        new_start_time = self.course_time.course_start_time
        new_end_time = self.course_time.course_end_time
        new_days = self.course_time.course_days
        new_classroom = self.classroom

        conflicting_courses = Course.objects.filter(
            classroom = new_classroom,
            course_time__course_days = new_days,

        ).filter(
            Q(course_time__course_start_time__lt = new_end_time, course_time__course_end_time__gt = new_start_time)
        ).exclude(id = self.id)

        if conflicting_courses.exists():
            raise ValidationError(
                f"Saat Çakışması: {new_classroom} sınıfında {new_days} günü "
                f"bu saatler arasında başka bir ders tanımlı!"
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


