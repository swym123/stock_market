
from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=100000.00)
    is_verified = models.BooleanField(default=False)
    account_type = models.CharField(
        max_length=10,
        choices=(("DEMO", "Demo"), ("LIVE", "Live")),
        default="DEMO"
    )
    risk_profile = models.CharField(
        max_length=20,
        choices=(("LOW", "Low"), ("MEDIUM", "Medium"), ("HIGH", "High")),
        default="MEDIUM"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watchlists")
    name = models.CharField(max_length=100)
    symbols = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.name}"
    class Meta:
        unique_together = ('user', 'symbols')

class Transaction(models.Model):
    TRANSACTION_TYPE = (
        ("BUY", "Buy"),
        ("SELL", "Sell"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    symbol = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.transaction_type} {self.symbol} ({self.quantity})"

# Add this import at the top
from django.core.cache import cache

# class Portfolio(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolio")
#     symbol = models.CharField(max_length=20)
#     company_name = models.CharField(max_length=200, default="Unknown Company")
#     quantity = models.PositiveIntegerField(default=0)
#     avg_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
#     current_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
#     last_updated = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username} - {self.symbol} ({self.quantity})"

#     @property
#     def current_value(self):
#         return self.quantity * float(self.current_price)
        
#     @property
#     def investment_value(self):
#         return self.quantity * float(self.avg_price)
        
#     @property
#     def profit_loss(self):
#         return self.current_value - self.investment_value
        
#     @property
#     def profit_loss_percentage(self):
#         if self.investment_value > 0:
#             return (self.profit_loss / self.investment_value) * 100
#         return 0
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolio")
#     symbol = models.CharField(max_length=20)
#     company_name = models.CharField(max_length=100, blank=True, null=True)
#     quantity = models.PositiveIntegerField(default=0)
#     avg_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
#     current_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
#     last_updated = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username} - {self.symbol} ({self.quantity})"

#     @property
#     def current_value(self):
#         return self.quantity * float(self.current_price)
        
#     @property
#     def investment_value(self):
#         return self.quantity * float(self.avg_price)
        
#     @property
#     def profit_loss(self):
#         return self.current_value - self.investment_value
        
#     @property
#     def profit_loss_percentage(self):
#         if self.investment_value > 0:
#             return (self.profit_loss / self.investment_value) * 100
#         return 0

class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="portfolio")
    symbol = models.CharField(max_length=20)
    company_name = models.CharField(max_length=200, default="Unknown Company", blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)

    # Allow larger numbers safely
    avg_price = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    current_price = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.symbol} ({self.quantity})"

    @property
    def current_value(self):
        return self.quantity * float(self.current_price)

    @property
    def investment_value(self):
        return self.quantity * float(self.avg_price)

    @property
    def profit_loss(self):
        return self.current_value - self.investment_value

    @property
    def profit_loss_percentage(self):
        if self.investment_value > 0:
            return (self.profit_loss / self.investment_value) * 100
        return 0
