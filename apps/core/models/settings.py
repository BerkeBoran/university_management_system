from django.db import models
from rest_framework.exceptions import ValidationError


class SystemSettings(models.Model):
    is_enrollment_open = models.BooleanField(default=False)
    enrollment_start_date = models.DateTimeField(null=True, blank=True)
    enrollment_end_date = models.DateTimeField(null=True, blank=True)

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