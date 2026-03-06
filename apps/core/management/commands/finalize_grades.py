from django.core.management import BaseCommand

from apps.courses.models import Enrollment


class Command(BaseCommand):
    help = 'Harf Notlarını Oluşturur'
    def handle(self, *args, **options):
        enrollments = Enrollment.objects.filter(
            midterm_grade__isnull=False,
            final_grade__isnull=False,
            letter_grade__isnull=True,
        )
        count = 0
        for enrollment in enrollments:
            grade = enrollment.calculate_letter_grade()
            if grade:
                enrollment.letter_grade = grade
                enrollment.save()
                count += 1

        self.stdout.write(self.style.SUCCESS(f'Başarıyla {count} adet ders notu sonuçlandırıldı.'))