from django.contrib import admin
from . import models
admin.site.register(models.StockIndex)
admin.site.register(models.Stock)