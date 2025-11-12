

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework import status
# from django.contrib.auth import get_user_model
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import (
#     UserSerializer, 
#     UserCreationSerializer,
#     CustomTokenObtainPairSerializer,
#     WatchlistSerializer
# )
# from rest_framework import viewsets
# from .models import Watchlist
# from rest_framework.permissions import AllowAny

# User = get_user_model()

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def signup(request):
#     serializer = UserCreationSerializer(data=request.data)
#     if serializer.is_valid():
#         user = serializer.save()
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "user": UserSerializer(user).data,
#             "tokens": {
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#             }
#         }, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login(request):
#     serializer = CustomTokenObtainPairSerializer(data=request.data)
#     try:
#         serializer.is_valid(raise_exception=True)
#         return Response({
#             "user": {
#                 "username": serializer.validated_data['username'],
#                 "email": serializer.validated_data['email'],
#                 "phone": serializer.validated_data['phone'],
#             },
#             "tokens": {
#                 "access": serializer.validated_data['access'],
#                 "refresh": serializer.validated_data['refresh'],
#             }
#         })
#     except Exception as e:
#         print(serializer.errors)
#         return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

# # Update the profile view
# from .serializers import ProfileUpdateSerializer


# @api_view(['GET', 'PUT'])
# @permission_classes([IsAuthenticated])
# def profile(request):
#     if request.method == 'GET':
#         serializer = UserSerializer(request.user)
#         return Response(serializer.data)
#     elif request.method == 'PUT':
#         serializer = ProfileUpdateSerializer(
#             request.user, 
#             data=request.data, 
#             partial=True,
#             context={'request': request}  # Pass request context for validation
#         )
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class WatchlistViewSet(viewsets.ModelViewSet):
#     serializer_class = WatchlistSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Watchlist.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     def delete(self, request, pk):
#         try:
#             watchlist_item = Watchlist.objects.get(user=request.user, id=pk)
#             watchlist_item.delete()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         except Watchlist.DoesNotExist:
#             return Response(
#                 {"error": "Item not found in watchlist"}, 
#                 status=status.HTTP_404_NOT_FOUND
#             )

# # views.py
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Watchlist , Transaction

# @api_view(['GET', 'POST'])
# @permission_classes([IsAuthenticated])
# def check_watchlist(request):
#     # More efficient query using values_list and flat=True
#     symbols = Watchlist.objects.filter(
#         user=request.user
#     ).values_list('symbols', flat=True)
    
#     # Flatten the list of lists
#     flattened_symbols = [symbol for sublist in symbols for symbol in sublist]
    
#     return Response({'symbols': list(set(flattened_symbols))})  # Ensure unique symbols

# # views.py
# import yfinance as yf
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def get_prices(request):
#     symbols = request.data.get('symbols', [])
#     prices = {}
    
#     for symbol in symbols:
#         try:
#             ticker = yf.Ticker(symbol)
#             data = ticker.history(period='2d')
#             if not data.empty:
#                 # Get current and previous closing prices
#                 current_price = data['Close'].iloc[-1]
#                 prev_close = data['Close'].iloc[-2]
                
#                 # Calculate change percentage
#                 change_percent = ((current_price - prev_close) / prev_close) * 100
                
#                 prices[symbol] = {
#                     'current_price': current_price,
#                     'change_percent': change_percent
#                 }
#             else:
#                 prices[symbol] = {'error': 'No data found'}
#         except Exception as e:
#             print(f"Error fetching price for {symbol}: {e}")
#             prices[symbol] = {'error': str(e)}
    
#     return Response({'prices': prices})


# from django.views.generic import ListView
# from django.contrib.auth.mixins import LoginRequiredMixin
# import yfinance as yf
# from .models import Watchlist

# class WatchlistSymbolsListView(LoginRequiredMixin, ListView):
#     template_name = 'watchlist_symbols.html'
#     context_object_name = 'symbol_data'

#     def get_queryset(self):
#         watchlist = Watchlist.objects.get(id=self.kwargs['watchlist_id'], user=self.request.user)
#         data = []
        
#         for symbol in watchlist.symbols:
#             try:
#                 ticker = yf.Ticker(symbol)
#                 info = ticker.info
#                 data.append({
#                     'symbol': symbol,
#                     'name': info.get('longName', symbol),
#                     'sector': info.get('sector', 'N/A'),
#                     'current_price': info.get('currentPrice', 'N/A')
#                 })
#             except:
#                 data.append({
#                     'symbol': symbol,
#                     'name': symbol,
#                     'sector': 'Error fetching data',
#                     'current_price': 'N/A'
#                 })
#         return data

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['watchlist'] = Watchlist.objects.get(
#             id=self.kwargs['watchlist_id'], 
#             user=self.request.user
#         )
#         return context
    
# from rest_framework import generics
# from decimal import Decimal

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_balance(request):
#     """
#     Returns the current balance of the authenticated user.
#     """
#     return Response({
#         'balance': float(request.user.balance),
#         'account_type': request.user.account_type,
#         'currency': 'Rupees'
#     })


# from rest_framework import generics
# from rest_framework.permissions import IsAuthenticated
# from .models import Portfolio, Transaction
# from .serializers import PortfolioSerializer, TransactionSerializer


# class TransactionHistoryView(generics.ListAPIView):
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
        
#         return Transaction.objects.filter(user=self.request.user).order_by('-date')
    

# class TransactionCreateView(generics.CreateAPIView):
#     queryset = Transaction.objects.all()
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


# class TransactionHistoryView(generics.ListAPIView):
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return Transaction.objects.filter(user=self.request.user).order_by('-date')



# class TransactionCreateView(generics.CreateAPIView):
#     queryset = Transaction.objects.all()
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


# class TransactionHistoryView(generics.ListAPIView):
#     serializer_class = TransactionSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return Transaction.objects.filter(user=self.request.user).order_by('-date')


# class PortfolioView(generics.ListAPIView):
#     serializer_class = PortfolioSerializer
#     permission_classes = [IsAuthenticated]
    
#     def get_queryset(self):
#         return Portfolio.objects.filter(user=self.request.user).order_by('symbol')
    
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status

# class WatchlistPriceView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         symbols = request.data.get("symbols", [])
#         if not symbols:
#             return Response({"error": "No symbols provided"}, status=status.HTTP_400_BAD_REQUEST)

#         # Example dummy prices, replace with your logic
#         prices = {symbol: 100.0 for symbol in symbols}

#         return Response({"prices": prices}, status=status.HTTP_200_OK)

# # Add this view
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_funds(request):
#     try:
#         amount = Decimal(request.data.get('amount'))
#         if amount <= 0:
#             return Response({"error": "Amount must be positive"}, status=status.HTTP_400_BAD_REQUEST)
        
#         request.user.balance += amount
#         request.user.save()
#         return Response({
#             'success': f'Added ₹{amount} to your account',
#             'new_balance': float(request.user.balance)
#         }, status=status.HTTP_200_OK)
    
#     except (TypeError, ValueError):
#         return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer, 
    UserCreationSerializer,
    CustomTokenObtainPairSerializer,
    WatchlistSerializer,
    ProfileUpdateSerializer,
    TransactionSerializer,
    PortfolioSerializer
)
from .models import Watchlist, Transaction, Portfolio
from rest_framework.views import APIView
from decimal import Decimal
import yfinance as yf
from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserCreationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = CustomTokenObtainPairSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
        return Response({
            "user": {
                "username": serializer.validated_data['username'],
                "email": serializer.validated_data['email'],
                "phone": serializer.validated_data['phone'],
            },
            "tokens": {
                "access": serializer.validated_data['access'],
                "refresh": serializer.validated_data['refresh'],
            }
        })
    except Exception as e:
        print(serializer.errors)
        return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ProfileUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def buy(self, request, pk=None):
        """Handle buy action for a watchlist item"""
        try:
            watchlist = self.get_object()
            if not watchlist.symbols:
                return Response({"error": "No symbols in watchlist"}, status=status.HTTP_400_BAD_REQUEST)
            
            symbol = watchlist.symbols[0]  # Use the first symbol
            quantity = request.data.get('quantity', 1)
            
            # Get current price
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="1d")
                if history.empty:
                    return Response({"error": "Could not fetch current price"}, status=status.HTTP_400_BAD_REQUEST)
                
                current_price = Decimal(history['Close'].iloc[-1])
            except Exception as e:
                return Response({"error": f"Error fetching price: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create transaction
            transaction = Transaction(
                user=request.user,
                symbol=symbol,
                quantity=quantity,
                price=current_price,
                transaction_type="BUY"
            )
            transaction.save()
            
            return Response({
                "message": f"Successfully bought {quantity} shares of {symbol} at ₹{current_price}",
                "transaction_id": transaction.id
            }, status=status.HTTP_200_OK)
            
        except Watchlist.DoesNotExist:
            return Response({"error": "Watchlist not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            watchlist_item = Watchlist.objects.get(user=request.user, id=pk)
            watchlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Watchlist.DoesNotExist:
            return Response(
                {"error": "Item not found in watchlist"}, 
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def check_watchlist(request):
    symbols = Watchlist.objects.filter(
        user=request.user
    ).values_list('symbols', flat=True)
    
    flattened_symbols = [symbol for sublist in symbols for symbol in sublist]
    
    return Response({'symbols': list(set(flattened_symbols))})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_prices(request):
    symbols = request.data.get('symbols', [])
    prices = {}
    
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period='2d')
            if not data.empty:
                current_price = data['Close'].iloc[-1]
                prev_close = data['Close'].iloc[-2]
                
                change_percent = ((current_price - prev_close) / prev_close) * 100
                
                prices[symbol] = {
                    'current_price': current_price,
                    'change_percent': change_percent
                }
            else:
                prices[symbol] = {'error': 'No data found'}
        except Exception as e:
            print(f"Error fetching price for {symbol}: {e}")
            prices[symbol] = {'error': str(e)}
    
    return Response({'prices': prices})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_balance(request):
    return Response({
        'balance': float(request.user.balance),
        'account_type': request.user.account_type,
        'currency': 'Rupees'
    })

# ... existing code ...

class TransactionCreateView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the validated data
        validated_data = serializer.validated_data
        
        # Check if it's a buy transaction and user has enough balance
        if validated_data['transaction_type'] == 'BUY':
            total_cost = Decimal(validated_data['quantity']) * validated_data['price']
            if total_cost > self.request.user.balance:
                raise serializers.ValidationError("Insufficient balance")
        
        # Save the transaction
        transaction = serializer.save(user=self.request.user)
        
        # The signal will handle the balance update and portfolio changes

# ... existing code ...
class TransactionHistoryView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

class PortfolioView(generics.ListAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Update current prices before returning portfolio
        portfolios = Portfolio.objects.filter(user=self.request.user)
        
        for portfolio in portfolios:
            try:
                ticker = yf.Ticker(portfolio.symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    portfolio.current_price = Decimal(history['Close'].iloc[-1])
                    portfolio.save()
            except Exception as e:
                logger.error(f"Error updating price for {portfolio.symbol}: {e}")
                
        return portfolios.order_by('symbol')

class WatchlistPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        symbols = request.data.get("symbols", [])
        if not symbols:
            return Response({"error": "No symbols provided"}, status=status.HTTP_400_BAD_REQUEST)

        prices = {}
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    prices[symbol] = float(history['Close'].iloc[-1])
                else:
                    prices[symbol] = 0.0
            except:
                prices[symbol] = 0.0

        return Response({"prices": prices}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_funds(request):
    try:
        amount = Decimal(request.data.get('amount'))
        if amount <= 0:
            return Response({"error": "Amount must be positive"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.balance += amount
        request.user.save()
        return Response({
            'success': f'Added ₹{amount} to your account',
            'new_balance': float(request.user.balance)
        }, status=status.HTTP_200_OK)
    
    except (TypeError, ValueError):
        return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watchlist_prices(request):
    """Get current prices for all symbols in user's watchlists"""
    try:
        # Get all symbols from user's watchlists
        watchlists = Watchlist.objects.filter(user=request.user)
        all_symbols = []
        
        for watchlist in watchlists:
            all_symbols.extend(watchlist.symbols)
        
        # Remove duplicates
        all_symbols = list(set(all_symbols))
        
        # Get prices for all symbols
        prices = {}
        for symbol in all_symbols:
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    prices[symbol] = float(history['Close'].iloc[-1])
                else:
                    prices[symbol] = 0.0
            except:
                prices[symbol] = 0.0
        
        return Response({"prices": prices}, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_holdings(request):
    """
    Get user's stock holdings with current prices
    """
    try:
        # Get user's portfolio
        portfolios = Portfolio.objects.filter(user=request.user)
        
        # Prepare response data
        holdings = []
        for portfolio in portfolios:
            # Update current price
            try:
                ticker = yf.Ticker(portfolio.symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    portfolio.current_price = Decimal(history['Close'].iloc[-1])
                    portfolio.save()
            except Exception as e:
                logger.error(f"Error updating price for {portfolio.symbol}: {e}")
            
            holdings.append({
                'symbol': portfolio.symbol,
                'company_name': portfolio.company_name,
                'quantity': portfolio.quantity,
                'average_price': float(portfolio.avg_price),
                'current_price': float(portfolio.current_price),
                'investment_value': float(portfolio.investment_value),
                'current_value': float(portfolio.current_value),
                'profit_loss': float(portfolio.profit_loss),
                'profit_loss_percentage': float(portfolio.profit_loss_percentage)
            })
        
        return Response({'holdings': holdings}, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error fetching holdings: {e}")
        return Response(
            {'error': 'Failed to fetch holdings'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )