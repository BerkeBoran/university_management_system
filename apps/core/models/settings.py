from django.db import models
from django.utils import timezone
from rest_framework.exceptions import ValidationError


class SystemSettings(models.Model):
    is_enrollment_open = models.BooleanField(default=False)
    enrollment_start_date = models.DateTimeField(null=True, blank=True)
    enrollment_end_date = models.DateTimeField(null=True, blank=True)

    is_midterm_open = models.BooleanField(default=False)
    midterm_start_date = models.DateTimeField(null=True, blank=True)
    midterm_end_date = models.DateTimeField(null=True, blank=True)

    is_final_open = models.BooleanField(default=False)
    final_start_date = models.DateTimeField(null=True, blank=True)
    final_end_date = models.DateTimeField(null=True, blank=True)

    is_makeup_open = models.BooleanField(default=False)
    makeup_start_date = models.DateTimeField(null=True, blank=True)
    makeup_end_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'System Settings'
        verbose_name_plural = 'System Settings'


    def save(self, *args, **kwargs):
        if not self.pk and SystemSettings.objects.exists():
            raise ValidationError("Bir sistem ayarı olabilir")
        return super().save(*args, **kwargs)


    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(id = 1)
        return settings


    @property
    def is_midterm_currently_active(self):
        now = timezone.now()
        return(
            self.is_midterm_open and
            self.midterm_start_date and
            self.midterm_end_date and
            self.midterm_start_date <= now <= self.midterm_end_date
        )


    @property
    def is_final_currently_active(self):
        now = timezone.now()
        return(
            self.is_final_currently_active and
            self.final_start_date and
            self.final_end_date and
            self.final_start_date <= now <= self.final_end_date
        )


    @property
    def is_makeup_currently_active(self):
        now = timezone.now()
        return(
            self.is_makeup_currently_active and
            self.makeup_start_date and
            self.makeup_end_date and
            self.makeup_start_date <= now <= self.makeup_end_date
        )