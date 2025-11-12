# from django.db import models

# class Company(models.Model):
#     name = models.CharField(max_length=255)
#     tradingsymbol = models.CharField(max_length=50)
#     instrument_key = models.CharField(max_length=100)

#     def __str__(self):
        
#         return f"{self.tradingsymbol} - {self.name}"

from django.db import models

class Company(models.Model):
    EXCHANGE_CHOICES = (
        ("NSE", "NSE"),
        ("BSE", "BSE"),
    )

    name = models.CharField(max_length=255)
    tradingsymbol = models.CharField(max_length=50)
    instrument_key = models.CharField(max_length=100)
    exchange = models.CharField(
        max_length=10,
        choices=EXCHANGE_CHOICES,
        default="NSE"   # or leave blank if unknown
    )

    def __str__(self):
        return f"{self.tradingsymbol} - {self.name} ({self.exchange})"
