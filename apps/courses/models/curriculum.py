from django.db import models

from apps.courses.models import Course


class Curriculum(models.Model):
    department = models.ForeignKey('courses.Department', on_delete=models.SET_NULL, null=True)
    year = models.IntegerField()
    total_ecs_requrired = models.IntegerField(default=240)

    class Meta:
        unique_together = ('department', 'year')


class CurriculumDetail(models.Model):
    COURSE_TYPE = (
        ('Z', 'Zorunlu'),
        ('S', 'Seçmeli')
    )
    curriculum = models.ForeignKey('Curriculum', on_delete=models.SET_NULL, null=True,related_name='detail')
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    semester = models.IntegerField()
    course_type = models.CharField(max_length=1, choices=COURSE_TYPE, default='Z')

    class Meta:
        unique_together = ('curriculum', 'course')