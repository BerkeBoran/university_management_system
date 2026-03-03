from django.db import models

from apps.courses.models.section import Section


class Enrollment(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='enrollment')
    section = models.ForeignKey(Section, on_delete=models.CASCADE,related_name='enrollment')

    midterm_grade = models.DecimalField(max_digits=5, decimal_places=2,null=True,blank=True)
    final_grade = models.DecimalField(max_digits=5, decimal_places=2,null=True,blank=True)

    class Meta:
        unique_together = (('student', 'section'),)

    def __str__(self):
        return f"{self.student.username} {self.section.course_name}"