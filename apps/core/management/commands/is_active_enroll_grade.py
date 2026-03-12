from datetime import datetime
from django.utils import timezone

from django.core.management import BaseCommand

from apps.core.models import SystemSettings


class Command(BaseCommand):
    help = ('Sınav notu girişlerini başlatır ve bitirir.')

    def add_arguments(self, parser):
        def valid_date(value):
            try:
                dt = datetime.strptime(value, '%d.%m.%Y')
                return timezone.make_aware(dt,   timezone.get_current_timezone())
            except ValueError:
                raise ValueError(f"Geçersiz tarih formatı:GG.AA.YYYY kullanın.")

        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument('--midterm',action='store_true',help='Vize ayarları için')
        group.add_argument('--final',action='store_true',help='Final ayarları için')
        group.add_argument('--makeup',action='store_true',help='Bütünleme ayarları için')

        parser.add_argument('--start', type=valid_date, help='Başlangıç Tarihi (GG.AA.YYYY)')
        parser.add_argument('--end', type=valid_date,help='Bitiş Tarihi (GG.AA.YYYY)')
        parser.add_argument('--close', action='store_true',help='Vize Girişlerini kapatır')

    def handle(self, *args, **options):
        settings = SystemSettings.get_settings()
        if options['midterm']:
            prefix = "midterm"
            label = "Vize"
        elif options['final']:
            prefix = "final"
            label = "Final"
        else:
            prefix = "makeup"
            label = "Bütünleme"

        if options['close']:
            setattr(settings, f"is_{prefix}_open", False)
            setattr(settings, f"{prefix}_start_date", None)
            setattr(settings, f"{prefix}_end_date", None)
            settings.save()
            self.stdout.write(self.style.SUCCESS(f'{label} girişleri kapatıldı!'))
            return

        start = options['start']
        end = options['end']

        if not start or not end:
            self.stdout.write(self.style.ERROR(f'Hata: {label} açmak için hem --start hem de --end gereklidir!'))
            return

        if end <= start:
            self.stdout.write(self.style.ERROR('Hata: Bitiş tarihi başlangıçtan sonra olmalıdır!'))
            return

        setattr(settings, f"is_{prefix}_open", True)
        setattr(settings, f"{prefix}_start_date", start)
        setattr(settings, f"{prefix}_end_date", end)
        settings.save()

        self.stdout.write(self.style.SUCCESS(
            f'{label} girişleri başarıyla ayarlandı!\n'
            f'Aralık: {start.strftime("%d.%m.%Y")} - {end.strftime("%d.%m.%Y")}'
        ))