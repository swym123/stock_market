from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Company
from .serializers import CompanySerializer

@api_view(['GET'])
def company_search(request):
    query = request.GET.get('q', '')
    if query:
        companies = Company.objects.filter(
            Q(tradingsymbol__icontains=query) | 
            Q(name__icontains=query)
        )[:5]  # Limit to 5 suggestions
        serializer = CompanySerializer(companies, many=True)
        return Response(serializer.data)
    return Response([])

# # views.py
# import yfinance as yf
# from django.http import JsonResponse
# from django.views.decorators.cache import cache_page

# @cache_page(60 * 15)  # Cache for 15 minutes
# def get_company_info(request, symbol):
#     try:
#         # Ensure symbol has .NS suffix if not provided
#         if not symbol.endswith('.NS') and not symbol.endswith('.BO'):
#             symbol += '.NS'
            
#         ticker = yf.Ticker(symbol)
#         info = ticker.info
        
#         response_data = {
#             'status': 'success',
#             'data': {
#                 'companyName': info.get('longName', 'N/A'),
#                 'sector': info.get('sector', 'N/A'),
#                 'industry': info.get('industry', 'N/A'),
#                 'marketCap': info.get('marketCap', 0),
#                 'currentPrice': info.get('currentPrice', 0),
#                 'peRatio': info.get('trailingPE', 0),
#                 'bookValue': info.get('bookValue', 0),
#                 'dividendYield': info.get('dividendYield', 0),
#                 'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 0),
#                 'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 0),
#                 'volume': info.get('volume', 0),
#                 'averageVolume': info.get('averageVolume', 0),
#                 'currency': info.get('currency', 'INR'),
#                 'exchange': info.get('exchange', 'NSE'),
#                 'symbol': symbol
#             }
#         }
#         return JsonResponse(response_data)
        
#     except Exception as e:
#         return JsonResponse({
#             'status': 'error',
#             'message': str(e)
#         }, status=400)
    

import yfinance as yf
from django.http import JsonResponse
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # Cache for 15 minutes
def get_company_info(request, symbol):
    try:
        # Ensure symbol has .NS suffix if not provided
        if not symbol.endswith('.NS') and not symbol.endswith('.BO'):
            symbol += '.NS'
        
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # Get query params (default: 7d, 1d)
        interval = request.GET.get("interval", "1d")
        period = request.GET.get("period", "7d")

        # Fetch historical data
        hist = ticker.history(interval=interval, period=period)
        history_data = []
        for idx, row in hist.iterrows():
            history_data.append({
                "time": idx.strftime("%Y-%m-%d %H:%M:%S"),
                "open": row["Open"],
                "high": row["High"],
                "low": row["Low"],
                "close": row["Close"],
                "volume": row["Volume"],
            })

        response_data = {
            'status': 'success',
            'data': {
                'companyName': info.get('longName', 'N/A'),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'marketCap': info.get('marketCap', 0),
                'currentPrice': info.get('currentPrice', 0),
                'previousClose': info.get('previousClose', 0),   # ✅ Added
                'open': info.get('open', 0),                     # ✅ Added
                'dayHigh': info.get('dayHigh', 0),               # ✅ Added
                'dayLow': info.get('dayLow', 0),                 # ✅ Addedv
                'peRatio': info.get('trailingPE', 0),
                'bookValue': info.get('bookValue', 0),
                'dividendYield': info.get('dividendYield', 0),
                'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 0),
                'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 0),
                'volume': info.get('volume', 0),
                'averageVolume': info.get('averageVolume', 0),
                'currency': info.get('currency', 'INR'),
                'exchange': info.get('exchange', 'NSE'),
                'symbol': symbol,
                'history': history_data  # 📊 Add graph data here
            }
        }
        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)



from rest_framework import generics
from .models import Company
from .serializers import CompanySerializer

class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests

NEWS_DATA_API_KEY = "pub_fac35ec9d13e4959bd14f77f27ccd8f7"
MARKETAUX_API_KEY = "s7CDVsIfwBWm67vD2TsCBkZCzcIRbeat3L5XvtZo"

def fetch_marketaux_news(company):
    marketaux_url = (
        f"https://api.marketaux.com/v1/news/all?symbols={company}.NS"
        f"&filter_entities=true&language=en&api_token={MARKETAUX_API_KEY}"
    )
    try:
        res = requests.get(marketaux_url)
        data = res.json()
        if "data" in data and data["data"]:
            return [
                {
                    "title": a["title"],
                    "description": a.get("description", ""),
                    "link": a["url"],
                    "image": a.get("image_url", ""),
                    "published": a["published_at"]
                }
                for a in data["data"][:8]
            ]
    except:
        return None

def fetch_newsdata_news(query):
    newsdata_url = (
        f"https://newsdata.io/api/1/news?apikey={NEWS_DATA_API_KEY}"
        f"&country=in&language=en&q={query}"
    )
    try:
        res = requests.get(newsdata_url)
        data = res.json()
        return [
            {
                "title": i.get("title"),
                "description": i.get("description", "")[:200],
                "link": i.get("link"),
                "image": i.get("image_url", ""),
                "published": i.get("pubDate", "N/A")
            }
            for i in data.get("results", [])[:8]
        ]
    except:
        return None

@csrf_exempt
def company_news(request):
    if request.method == 'GET':
        company = request.GET.get('q', '')
        
        # If no query provided, fetch default market news
        if not company:
            # Try to get general market news
            news = fetch_marketaux_news('SBI') or fetch_newsdata_news('stock market')
            if news:
                return JsonResponse(news, safe=False)
            return JsonResponse([], safe=False)
        
        # Try Marketaux API first
        news = fetch_marketaux_news(company)
        if news:
            return JsonResponse(news, safe=False)
        
        # Fallback to NewsData.io
        news = fetch_newsdata_news(company)
        if news:
            return JsonResponse(news, safe=False)
        
        return JsonResponse([], safe=False)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)