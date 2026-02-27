from datetime import timedelta
from django.utils import timezone
from django.core.management import BaseCommand
from apps.core.models import SystemSettings


class Command(BaseCommand):
    help = 'Ders Kayıtlarını başlatır ve ne kadar süreceğini ayarlar'

    def add_arguments(self, parser):
        parser.add_argument('days', type=int,help = 'Ders kayıtlarının kaç gün süreceği')

    def handle(self, *args, **options):
        days = options['days']
        start_date = timezone.now()
        end_date = start_date + timedelta(days=days)

        settings, created = SystemSettings.objects.get_or_create(id=1)

        settings.is_enrollment_open = True
        settings.enrollment_start_date = start_date
        settings.enrollment_end_date = end_date
        settings.save()

        self.stdout.write(self.style.SUCCESS(f'Kayıtlar {days} günlüğüne başarıyla açıldı!'))
        self.stdout.write(f'Bitiş Tarihi: {end_date}')