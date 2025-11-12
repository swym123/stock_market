from django.urls import path
from . import views

urlpatterns = [
    path('market-data/', views.get_market_data, name='market_data'),
    path('top-stocks/', views.get_top_gainers_losers, name='top_stocks'),
    path('stock/<str:symbol>/', views.get_stock_data, name='stock_data'),
]