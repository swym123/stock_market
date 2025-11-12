from django.urls import path
from .views import company_search  # Changed from stock_search to company_search
from . import views
from .views import CompanyListView

urlpatterns = [
    path('search/', company_search, name='company-search'),  # Updated name here
    path('stocks/<str:symbol>/', views.get_company_info, name='company_api'),
    path("companies/", CompanyListView.as_view(), name="company-list"),
    path('news/', views.company_news, name='company_news'),
    # ... your other URLs
]