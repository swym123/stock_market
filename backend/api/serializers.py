from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'tradingsymbol', 'instrument_key']


from rest_framework import serializers
from .models import Company
import yfinance as yf


class CompanySerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    day_change_percent = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'tradingsymbol', 'instrument_key', 'current_price', 'day_change_percent']

    def get_current_price(self, obj):
        try:
            print(type(obj.tradingsymbol))
            ticker = yf.Ticker((obj.tradingsymbol))
            data = ticker.history(period="1d")
            if not data.empty:
                print(data["Close"].iloc[-1])
                return round(data["Close"].iloc[-1], 2)
            
        except Exception as e:
            return None
        return None

    def get_day_change_percent(self, obj):
        try:
            ticker = yf.Ticker((obj.tradingsymbol))
            data = ticker.history(period="2d")
            if len(data) >= 2:
                prev_close = data["Close"].iloc[-2]
                today_close = data["Close"].iloc[-1]
                print(round(((today_close - prev_close) / prev_close) * 100, 2))
                return round(((today_close - prev_close) / prev_close) * 100, 2)
        except Exception as e:
            return None
        return None

