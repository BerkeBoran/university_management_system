from django.db import models
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.courses.models import Course

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

class Section(models.Model):
    section_number = models.PositiveIntegerField()

    course_time = models.ForeignKey(CourseTime, on_delete=models.CASCADE,null=True)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,limit_choices_to={'role': 'Instructor'},related_name = 'sections')
    semester = models.ForeignKey(Semester,on_delete=models.CASCADE,related_name = 'sections',null=True)
    classroom = models.ForeignKey(Classroom,on_delete=models.CASCADE,related_name = 'sections')
    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name = 'sections')
    capacity = models.PositiveIntegerField(null = True, blank = True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        unique_together= ('course','semester','section_number')


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

    @property
    def remaining_capacity(self):
        enrolled_count = self.enrollments.count()
        return max(0, enrolled_count)

    def __str__(self):
        return f"{self.course.course_name} - Section {self.section_number}"