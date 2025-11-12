# from rest_framework import serializers
# from django.contrib.auth import get_user_model, authenticate
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from .models import Watchlist  # Add this import

# # Add these imports at the top of the file

# from .models import (
#     User,
#     Watchlist,
#     Transaction,  # Add this
#     Portfolio     # Add this
# )

# User = get_user_model()

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'phone', 'balance')

# class UserCreationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=True)
    
#     class Meta:
#         model = User
#         fields = ('username', 'email', 'phone', 'password')
    
#     def validate(self, attrs):
#         if User.objects.filter(username=attrs['username']).exists():
#             raise serializers.ValidationError({"username": "This username is already taken."})
#         if User.objects.filter(email=attrs['email']).exists():
#             raise serializers.ValidationError({"email": "This email is already registered."})
#         return attrs
    
#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             phone=validated_data.get('phone', ''),
#             password=validated_data['password']
#         )
#         return user

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         username_or_email = attrs.get("username")
#         password = attrs.get("password")

#         # Try authenticating with username first
#         user = authenticate(username=username_or_email, password=password)

#         # If not found, try with email
#         if user is None:
#             try:
#                 email_user = User.objects.get(email=username_or_email)
#                 user = authenticate(username=email_user.username, password=password)
#             except User.DoesNotExist:
#                 pass

#         if user is None:
#             raise serializers.ValidationError("Invalid credentials")

#         refresh = self.get_token(user)
#         data = {
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "username": user.username,
#             "email": user.email,
#             "phone": user.phone,
#         }
#         return data

# class WatchlistSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Watchlist
#         fields = ["id", "user", "name", "symbols", "created_at"]
#         read_only_fields = ["user"]

# # serializers.py (add this class)
# # Add this to serializers.py
# class ProfileUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('username', 'email', 'phone', 'account_type', 'risk_profile')
#         extra_kwargs = {
#             'username': {'required': False},
#             'email': {'required': False},
#         }

#     def validate_email(self, value):
#         user = self.context['request'].user
#         if User.objects.filter(email=value).exclude(pk=user.pk).exists():
#             raise serializers.ValidationError("This email is already registered.")
#         return value

#     def validate_username(self, value):
#         user = self.context['request'].user
#         if User.objects.filter(username=value).exclude(pk=user.pk).exists():
#             raise serializers.ValidationError("This username is already taken.")
#         return value
#     class Meta:
#         model = User
#         fields = ('username', 'email', 'phone', 'account_type', 'risk_profile')
#         extra_kwargs = {
#             'username': {'required': False},
#             'email': {'required': False},
#         }

#     def validate_email(self, value):
#         if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
#             raise serializers.ValidationError("This email is already registered.")
#         return value

#     def validate_username(self, value):
#         if User.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
#             raise serializers.ValidationError("This username is already taken.")
#         return value
    





# from rest_framework import serializers
# from .models import Transaction , Portfolio


# class TransactionSerializer(serializers.ModelSerializer):
#     total = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Transaction
#         fields = ['id', 'symbol', 'quantity', 'price', 'total', 'transaction_type', 'date']
#         read_only_fields = ['id', 'date']
    
#     def get_total(self, obj):
#         return float(obj.quantity) * float(obj.price)
    

# class PortfolioSerializer(serializers.ModelSerializer):
#     current_value = serializers.SerializerMethodField()
#     company_name = serializers.SerializerMethodField()
#     current_price = serializers.SerializerMethodField()
#     profit_loss = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Portfolio
#         fields = [
#             'symbol', 
#             'company_name', 
#             'quantity', 
#             'avg_price',
#             'current_price',
#             'current_value',
#             'profit_loss'
#         ]
    
#     def get_current_value(self, obj):
#         return float(obj.quantity) * float(obj.avg_price)
    
#     def get_company_name(self, obj):
#         # Implement logic to get company name from your Company model
#         # For now, return symbol as fallback
#         return obj.symbol
    
#     def get_current_price(self, obj):
#         # Implement logic to fetch current market price
#         # For now, return avg_price as fallback
#         return float(obj.avg_price)
    
#     def get_profit_loss(self, obj):
#         # Calculate profit/loss percentage
#         current_value = float(obj.quantity) * float(obj.avg_price)
#         cost_basis = float(obj.quantity) * float(obj.avg_price)
#         if cost_basis == 0:
#             return 0
#         return ((current_value - cost_basis) / cost_basis) * 100
 
# from decimal import Decimal

# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated

# from .models import Transaction
# from .serializers import TransactionSerializer
# class TransactionCreateView(generics.CreateAPIView):
#     queryset = Transaction.objects.all()
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         # Get current user balance
#         user = request.user
#         symbol = request.data.get('symbol')
#         quantity = int(request.data.get('quantity'))
#         price = Decimal(request.data.get('price'))
        
#         total_cost = quantity * price
        
#         # Check sufficient balance
#         if total_cost > user.balance:
#             return Response(
#                 {'error': 'Insufficient balance'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         # Create transaction
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save(user=user)
        
#         # Update user balance
#         user.balance -= total_cost
#         user.save()
        
#         headers = self.get_success_headers(serializer.data)
#         return Response(
#             serializer.data, 
#             status=status.HTTP_201_CREATED, 
#             headers=headers
#         )
    




# class TransactionSerializer(serializers.ModelSerializer):
#     total = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Transaction
#         fields = ['id', 'symbol', 'quantity', 'price', 'total', 'transaction_type', 'date']
#         read_only_fields = ['id', 'date']
    
#     def get_total(self, obj):
#         return float(obj.quantity) * float(obj.price)

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Watchlist, Transaction, Portfolio
from decimal import Decimal
import yfinance as yf

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'balance')

class UserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'password')
    
    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        # Try authenticating with username first
        user = authenticate(username=username_or_email, password=password)

        # If not found, try with email
        if user is None:
            try:
                email_user = User.objects.get(email=username_or_email)
                user = authenticate(username=email_user.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            raise serializers.ValidationError("Invalid credentials")

        refresh = self.get_token(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
        }
        return data

class WatchlistSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    change_percent = serializers.SerializerMethodField()
    
    class Meta:
        model = Watchlist
        fields = ["id", "user", "name", "symbols", "current_price", "change_percent", "created_at"]
        read_only_fields = ["user", "current_price", "change_percent"]

    def get_current_price(self, obj):
        # Get the first symbol for price lookup
        if obj.symbols and len(obj.symbols) > 0:
            symbol = obj.symbols[0]
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    return float(history['Close'].iloc[-1])
            except:
                pass
        return 0.0

    def get_change_percent(self, obj):
        # Get the first symbol for change percentage
        if obj.symbols and len(obj.symbols) > 0:
            symbol = obj.symbols[0]
            try:
                ticker = yf.Ticker(symbol)
                data = ticker.history(period='2d')
                if not data.empty and len(data) >= 2:
                    current_price = data['Close'].iloc[-1]
                    prev_close = data['Close'].iloc[-2]
                    return ((current_price - prev_close) / prev_close) * 100
            except:
                pass
        return 0.0
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'account_type', 'risk_profile')
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False},
        }

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.filter(username=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

# ... existing code ...

class TransactionSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = ['id', 'symbol', 'quantity', 'price', 'total', 'transaction_type', 'date']
        read_only_fields = ['id', 'date']
    
    def get_total(self, obj):
        return float(obj.quantity) * float(obj.price)
    
    def validate(self, data):
        # Check if user has enough balance for buy transactions
        if data['transaction_type'] == 'BUY':
            total_cost = Decimal(data['quantity']) * data['price']
            user = self.context['request'].user
            if total_cost > user.balance:
                raise serializers.ValidationError("Insufficient balance for this transaction")
        return data

# ... existing code ...
class PortfolioSerializer(serializers.ModelSerializer):
    current_value = serializers.SerializerMethodField()
    investment_value = serializers.SerializerMethodField()
    profit_loss = serializers.SerializerMethodField()
    profit_loss_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Portfolio
        fields = [
            'symbol', 
            'company_name', 
            'quantity', 
            'avg_price',
            'current_price',
            'current_value',
            'investment_value',
            'profit_loss',
            'profit_loss_percentage',
            'last_updated'
        ]
    
    def get_current_value(self, obj):
        return float(obj.current_value)
    
    def get_investment_value(self, obj):
        return float(obj.investment_value)
    
    def get_profit_loss(self, obj):
        return float(obj.profit_loss)
    
    def get_profit_loss_percentage(self, obj):
        return float(obj.profit_loss_percentage)