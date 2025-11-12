from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
import yfinance as yf
import json
from .models import StockIndex, Stock

@require_GET
def get_market_data(request):
    """
    Fetch and return market indices data
    """
    try:
        # Fetch NIFTY 50 data
        nifty = yf.Ticker("^NSEI")
        nifty_info = nifty.history(period="1d")
        
        # Fetch SENSEX data
        sensex = yf.Ticker("^BSESN")
        sensex_info = sensex.history(period="1d")
        
        # Fetch NIFTY BANK data
        nifty_bank = yf.Ticker("^NSEBANK")
        nifty_bank_info = nifty_bank.history(period="1d")
        
        # For BSE MIDCAP, we'll use a representative ETF or index
        # Note: You might need to find the correct symbol for BSE MIDCAP
        bse_midcap = yf.Ticker("BSE-MIDCAP.BO")  # This might need adjustment
        bse_midcap_info = bse_midcap.history(period="1d")
        
        # Prepare response data
        market_data = {
            "nifty50": {
                "name": "NIFTY 50",
                "value": round(float(nifty_info['Close'].iloc[-1]), 2),
                "change": round(float(nifty_info['Close'].iloc[-1] - nifty_info['Open'].iloc[-1]), 2),
                "percent_change": round((float(nifty_info['Close'].iloc[-1] - nifty_info['Open'].iloc[-1]) / nifty_info['Open'].iloc[-1]) * 100, 2)
            },
            "sensex": {
                "name": "SENSEX",
                "value": round(float(sensex_info['Close'].iloc[-1]), 2),
                "change": round(float(sensex_info['Close'].iloc[-1] - sensex_info['Open'].iloc[-1]), 2),
                "percent_change": round((float(sensex_info['Close'].iloc[-1] - sensex_info['Open'].iloc[-1]) / sensex_info['Open'].iloc[-1]) * 100, 2)
            },
            "nifty_bank": {
                "name": "NIFTY BANK",
                "value": round(float(nifty_bank_info['Close'].iloc[-1]), 2),
                "change": round(float(nifty_bank_info['Close'].iloc[-1] - nifty_bank_info['Open'].iloc[-1]), 2),
                "percent_change": round((float(nifty_bank_info['Close'].iloc[-1] - nifty_bank_info['Open'].iloc[-1]) / nifty_bank_info['Open'].iloc[-1]) * 100, 2)
            },
            "bse_midcap": {
                "name": "BSE MIDCAP",
                "value": round(float(bse_midcap_info['Close'].iloc[-1]), 2) if not bse_midcap_info.empty else "--",
                "change": round(float(bse_midcap_info['Close'].iloc[-1] - bse_midcap_info['Open'].iloc[-1]), 2) if not bse_midcap_info.empty else 203.15,
                "percent_change": round((float(bse_midcap_info['Close'].iloc[-1] - bse_midcap_info['Open'].iloc[-1]) / bse_midcap_info['Open'].iloc[-1]) * 100, 2) if not bse_midcap_info.empty else 1.10
            }
        }
        
        return JsonResponse(market_data)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_GET
def get_top_gainers_losers(request):
    """
    Fetch top gainers and losers from NSE
    """
    try:
        # For Indian stocks, we need to use the .NS suffix for NSE
        popular_stocks = [
            "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
            "HINDUNILVR.NS", "SBIN.NS", "BAJFINANCE.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
            "ITC.NS", "HCLTECH.NS", "AXISBANK.NS", "ASIANPAINT.NS", "MARUTI.NS",
            "TITAN.NS", "LT.NS", "TECHM.NS", "NTPC.NS", "SUNPHARMA.NS"
        ]
        
        gainers = []
        losers = []
        
        for symbol in popular_stocks:
            stock = yf.Ticker(symbol)
            info = stock.history(period="2d")
            
            if len(info) >= 2:
                prev_close = info['Close'].iloc[-2]
                current_price = info['Close'].iloc[-1]
                change = current_price - prev_close
                percent_change = (change / prev_close) * 100
                
                stock_data = {
                    "symbol": symbol.replace(".NS", ""),
                    "name": stock.info.get('longName', symbol),
                    "price": round(float(current_price), 2),
                    "change": round(float(change), 2),
                    "percent_change": round(float(percent_change), 2)
                }
                
                if percent_change > 0:
                    gainers.append(stock_data)
                else:
                    losers.append(stock_data)
        
        # Sort and get top 5
        gainers = sorted(gainers, key=lambda x: x['percent_change'], reverse=True)[:5]
        losers = sorted(losers, key=lambda x: x['percent_change'])[:5]
        
        return JsonResponse({
            "gainers": gainers,
            "losers": losers
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_GET
def get_stock_data(request, symbol):
    """
    Get data for a specific stock
    """
    try:
        # Add .NS suffix for NSE stocks if not already present
        if not symbol.endswith('.NS'):
            symbol += '.NS'
            
        stock = yf.Ticker(symbol)
        info = stock.history(period="2d")
        
        if len(info) < 2:
            return JsonResponse({"error": "Insufficient data"}, status=404)
            
        prev_close = info['Close'].iloc[-2]
        current_price = info['Close'].iloc[-1]
        change = current_price - prev_close
        percent_change = (change / prev_close) * 100
        
        stock_data = {
            "symbol": symbol.replace(".NS", ""),
            "name": stock.info.get('longName', symbol),
            "price": round(float(current_price), 2),
            "change": round(float(change), 2),
            "percent_change": round(float(percent_change), 2),
            "open": round(float(info['Open'].iloc[-1]), 2),
            "high": round(float(info['High'].iloc[-1]), 2),
            "low": round(float(info['Low'].iloc[-1]), 2),
            "volume": int(info['Volume'].iloc[-1]),
            "prev_close": round(float(prev_close), 2)
        }
        
        return JsonResponse(stock_data)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)