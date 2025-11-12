from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Watchlist, Transaction, Portfolio


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "phone", "balance", "is_staff", "is_active")
    search_fields = ("username", "email", "phone")


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "created_at")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "symbol", "transaction_type", "quantity", "price", "date")
    list_filter = ("transaction_type", "date")


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("user", "symbol", "quantity", "avg_price", "current_value")
