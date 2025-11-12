# from django.urls import path, include
# from .views import signup, login, profile, WatchlistViewSet, check_watchlist , get_balance , PortfolioView, TransactionHistoryView , WatchlistPriceView
# from rest_framework.routers import DefaultRouter
# from . import views

# router = DefaultRouter()
# router.register(r'watchlist', WatchlistViewSet, basename='watchlist')

# urlpatterns = [
#     path("signup/", signup, name="signup"),
#     path("login/", login, name="login"),
#     path('profile/', profile, name='profile'),
#     path('watchlist/check/', check_watchlist, name='check_watchlist'),
#     path('transactions/', views.TransactionCreateView.as_view(), name='create-transaction'),
#     path("watchlist/prices/", WatchlistPriceView.as_view(), name="watchlist-prices"),
#     path('balance/', get_balance, name='get_balance'),
#     path('add_funds/', views.add_funds, name='add_funds'),
#     path('portfolio/', PortfolioView.as_view(), name='portfolio'),
#     path('transactions/history/', TransactionHistoryView.as_view(), name='transaction-history'),
#     path("", include(router.urls)),

# ]

from django.urls import path, include
from .views import (
    signup, login, profile, WatchlistViewSet, check_watchlist, 
    get_balance, PortfolioView, TransactionHistoryView, WatchlistPriceView,
    TransactionCreateView, add_funds, get_prices, watchlist_prices ,get_holdings
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path('profile/', profile, name='profile'),
    path('watchlist/check/', check_watchlist, name='check_watchlist'),
    path('transactions/', TransactionCreateView.as_view(), name='create-transaction'),
    path("watchlist/prices/", WatchlistPriceView.as_view(), name="watchlist-prices"),
    path('watchlist-all-prices/', watchlist_prices, name='watchlist-all-prices'),
    path('prices/', get_prices, name='get_prices'),
    path('balance/', get_balance, name='get_balance'),
    path('add_funds/', add_funds, name='add_funds'),
     path('holdings/', get_holdings, name='holdings'),
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    path('transactions/history/', TransactionHistoryView.as_view(), name='transaction-history'),
    path("", include(router.urls)),
]