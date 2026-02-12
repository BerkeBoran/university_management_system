from django.db import models
from .base import User

class Instructor(User):
    title = models.CharField(max_length=120)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = User.Role.Instructor
            first_name_clean = self.first_name.lower().replace(" ", "_")
            last_name_clean = self.last_name.lower().replace(" ", "_")

            self.username = f"{first_name_clean}_{last_name_clean}"
            
        super().save(*args, **kwargs)
