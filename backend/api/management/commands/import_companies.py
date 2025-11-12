# import csv
# from django.core.management.base import BaseCommand
# from api.models import Company  # replace 'stocks' with your actual app name

# class Command(BaseCommand):
#     help = "Import companies from CSV"

#     def handle(self, *args, **kwargs):
#         with open('company_ui_columns.csv', newline='', encoding='utf-8') as csvfile:
#             reader = csv.DictReader(csvfile)
#             for row in reader:
#                 Company.objects.update_or_create(
#                     tradingsymbol=row['tradingsymbol'],
#                     defaults={
#                         'name': row['name'],
#                         'instrument_key': row['instrument_key']
#                     }
#                 )
#         self.stdout.write(self.style.SUCCESS("✅ Companies imported successfully"))


# import csv
# from django.core.management.base import BaseCommand
# from api.models import Company  # change 'api' to your app name


# class Command(BaseCommand):
#     help = "Import companies from merged_companies.csv (with exchange info)"

#     def handle(self, *args, **kwargs):
#         inserted, updated = 0, 0

#         with open("merged_companies.csv", newline="", encoding="utf-8") as csvfile:
#             reader = csv.DictReader(csvfile)

#             for row in reader:
#                 tradingsymbol = row["tradingsymbol"].strip()
#                 name = row["name"].strip()
#                 instrument_key = row["instrument_key"].strip()
#                 exchange = row.get("exchange", "NSE").strip().upper()  # default NSE if missing

#                 obj, created = Company.objects.update_or_create(
#                     tradingsymbol=tradingsymbol,
#                     defaults={
#                         "name": name,
#                         "instrument_key": instrument_key,
#                         "exchange": exchange,
#                     },
#                 )

#                 if created:
#                     inserted += 1
#                 else:
#                     updated += 1

#         self.stdout.write(
#             self.style.SUCCESS(f"✅ Imported {inserted} new companies, Updated {updated}")
#         )


import csv
from django.core.management.base import BaseCommand
from api.models import Company  # change 'api' to your app name


class Command(BaseCommand):
    help = "Import companies from merged_companies.csv with .NS/.BO suffix"

    def handle(self, *args, **kwargs):
        inserted, updated = 0, 0

        with open("merged_companies.csv", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                name = row["name"].strip()
                instrument_key = row["instrument_key"].strip()
                exchange = row.get("exchange", "NSE").strip().upper()

                # Append suffix to tradingsymbol
                base_symbol = row["tradingsymbol"].strip()
                if exchange == "NSE":
                    tradingsymbol = f"{base_symbol}.NS"
                elif exchange == "BSE":
                    tradingsymbol = f"{base_symbol}.BO"
                else:
                    tradingsymbol = base_symbol  # fallback

                obj, created = Company.objects.update_or_create(
                    tradingsymbol=tradingsymbol,
                    defaults={
                        "name": name,
                        "instrument_key": instrument_key,
                        "exchange": exchange,
                    },
                )

                if created:
                    inserted += 1
                else:
                    updated += 1

        self.stdout.write(
            self.style.SUCCESS(f"✅ Imported {inserted} new companies, Updated {updated}")
        )
