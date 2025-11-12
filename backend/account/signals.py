# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from decimal import Decimal
# from .models import Transaction, Portfolio, User

# @receiver(post_save, sender=Transaction)
# def update_balance_and_portfolio(sender, instance, created, **kwargs):
#     if not created:
#         return

#     user = instance.user
#     qty = instance.quantity
#     price = instance.price
#     symbol = instance.symbol
#     total = Decimal(qty) * price

#     if instance.transaction_type == "BUY":
#         if user.balance < total:
#             raise ValueError("Insufficient funds")

#         user.balance -= total
#         user.save()

#         portfolio, _ = Portfolio.objects.get_or_create(user=user, symbol=symbol)
#         new_qty = portfolio.quantity + qty
#         if portfolio.quantity > 0:
#             portfolio.avg_price = ((portfolio.quantity * portfolio.avg_price) + (qty * price)) / new_qty
#         else:
#             portfolio.avg_price = price
#         portfolio.quantity = new_qty
#         portfolio.save()

#     elif instance.transaction_type == "SELL":
#         portfolio = Portfolio.objects.filter(user=user, symbol=symbol).first()
#         if not portfolio or portfolio.quantity < qty:
#             raise ValueError("Not enough shares to sell")

#         portfolio.quantity -= qty
#         if portfolio.quantity == 0:
#             portfolio.avg_price = Decimal(0.00)
#         portfolio.save()

#         user.balance += total
#         user.save()
from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal
import yfinance as yf
import logging
from .models import Transaction, Portfolio, User

logger = logging.getLogger(__name__)

# Cache for company names to reduce API calls
COMPANY_NAME_CACHE = {}

def get_company_name(symbol):
    """Get company name from cache or Yahoo Finance"""
    if symbol in COMPANY_NAME_CACHE:
        return COMPANY_NAME_CACHE[symbol]
    
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        company_name = info.get('longName', info.get('shortName', symbol))
        COMPANY_NAME_CACHE[symbol] = company_name
        return company_name
    except Exception as e:
        logger.warning(f"Could not fetch company name for {symbol}: {e}")
        COMPANY_NAME_CACHE[symbol] = symbol
        return symbol

@receiver(post_save, sender=Transaction)
def update_balance_and_portfolio(sender, instance, created, **kwargs):
    if not created:
        return

    user = instance.user
    qty = instance.quantity
    price = instance.price
    symbol = instance.symbol
    total = Decimal(qty) * price

    if instance.transaction_type == "BUY":
        if user.balance < total:
            raise ValueError("Insufficient funds")

        user.balance -= total
        user.save()

        # Get or create portfolio item
        portfolio, created = Portfolio.objects.get_or_create(
            user=user, 
            symbol=symbol
        )
        
        # Update company name if this is a new portfolio item or if it's unknown
        if created or portfolio.company_name == "Unknown Company":
            portfolio.company_name = get_company_name(symbol)
        
        # Calculate new average price
        if portfolio.quantity > 0:
            total_investment = (portfolio.quantity * portfolio.avg_price) + (qty * price)
            portfolio.avg_price = total_investment / (portfolio.quantity + qty)
        else:
            portfolio.avg_price = price
            
        # Update quantity
        portfolio.quantity += qty
        
        # Update current price
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period="1d")
            if not history.empty:
                portfolio.current_price = Decimal(history['Close'].iloc[-1])
            else:
                # If no current data, use the transaction price
                portfolio.current_price = price
        except Exception as e:
            logger.warning(f"Could not fetch current price for {symbol}: {e}")
            # If we can't get current price, use the transaction price
            portfolio.current_price = price
            
        portfolio.save()

    elif instance.transaction_type == "SELL":
        portfolio = Portfolio.objects.filter(user=user, symbol=symbol).first()
        if not portfolio or portfolio.quantity < qty:
            raise ValueError("Not enough shares to sell")

        # Update quantity
        portfolio.quantity -= qty
        
        # If all shares are sold, delete the portfolio item
        if portfolio.quantity == 0:
            portfolio.delete()
        else:
            # Update current price if possible
            try:
                ticker = yf.Ticker(symbol)
                history = ticker.history(period="1d")
                if not history.empty:
                    portfolio.current_price = Decimal(history['Close'].iloc[-1])
            except Exception as e:
                logger.warning(f"Could not fetch current price for {symbol}: {e}")
                # Keep the existing current price if we can't fetch a new one
                
            portfolio.save()

        # Add funds to user balance
        user.balance += total
        user.save()