from django.db import models

class StockIndex(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20, unique=True)
    current_value = models.DecimalField(max_digits=15, decimal_places=2)
    change = models.DecimalField(max_digits=15, decimal_places=2)
    percent_change = models.DecimalField(max_digits=5, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

class Stock(models.Model):
    name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20, unique=True)
    current_price = models.DecimalField(max_digits=15, decimal_places=2)
    change = models.DecimalField(max_digits=15, decimal_places=2)
    percent_change = models.DecimalField(max_digits=5, decimal_places=2)
    volume = models.BigIntegerField()
    market_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    is_top_gainer = models.BooleanField(default=False)
    is_top_loser = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.symbol})"