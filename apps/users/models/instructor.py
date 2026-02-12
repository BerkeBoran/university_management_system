import secrets
import string

from django.db import models
from .base import User

class Instructor(User):
    class Title(models.TextChoices):
        PROFESSOR = "PROF", "Profesör"
        ASSOC_PROF = "ASSOC_PROF", "Doçent"
        ASST_PROF = "ASST_PROF", "Dr. Öğr. Üyesi"
        LECTURER = "LECT", "Öğretim Görevlisi"
        RESEARCH_ASST = "RA", "Araştırma Görevlisi"

    title = models.CharField(
        max_length=10,
        choices=Title.choices,
        default=Title.LECTURER,
        verbose_name="Ünvan"
    )
    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = User.Role.INSTRUCTOR
            first_name_clean = self.first_name.lower().replace(" ", "_")
            last_name_clean = self.last_name.lower().replace(" ", "_")
            base_username = f"{first_name_clean} {last_name_clean}"
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            username = username.lower().replace(" ", "_")
            self.username = username

            alphabet = string.ascii_letters + string.digits
            temp_password = "".join(secrets.choice(alphabet) for i in range(8))
            self.set_password(temp_password)

            print(f"\n" + "=" * 30)
            print(f"YENİ Akademisyen KAYDI")
            print(f"Kullanıcı Adı: {self.username}")
            print(f"Geçici Şifre:  {temp_password}")
            print(f"Ünvan: {self.title}")
            print("=" * 30 + "\n")

        super().save(*args, **kwargs)
