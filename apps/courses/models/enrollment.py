from django.db import models
from decimal import Decimal

from apps.courses.models.section import Section


class Enrollment(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='enrollments')
    section = models.ForeignKey(Section, on_delete=models.CASCADE,related_name='enrollments')

    midterm_grade = models.DecimalField(max_digits=5, decimal_places=2,null=True,blank=True)
    final_grade = models.DecimalField(max_digits=5, decimal_places=2,null=True,blank=True)
    letter_grade = models.CharField(max_length=2, null=True, blank=True)
    makeup_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_active_makeup_grade = models.BooleanField(default=False)

    def calculate_letter_grade(self):
        if self.midterm_grade is None or self.final_grade is None:
            return None
        active_final_grade = self.final_grade
        if self.is_active_makeup_grade is True:
            if self.makeup_grade is None:
                active_final_grade = self.final_grade
            if self.makeup_grade:
                active_final_grade = self.makeup_grade


        if self.midterm_grade and active_final_grade:
            score = (self.midterm_grade * Decimal('0.4')) + (active_final_grade * Decimal('0.6'))
            if score >= 90: return "AA"
            if score >= 85: return "BA"
            if score >= 80: return "BB"
            if score >= 75: return "BC"
            if score >= 70: return "CC"
            if score >= 65: return "CD"
            if score >= 60: return "DD"
            return "FF"


    class Meta:
        unique_together = (('student', 'section'),)

    def __str__(self):
        return f"{self.student.username} {self.section.course_name}"