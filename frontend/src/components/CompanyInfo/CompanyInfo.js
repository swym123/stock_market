
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Building, ArrowUp, ArrowDown, 
  Plus, Minus, X, ShoppingCart, Star 
} from 'lucide-react';

const CompanyInfo = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [userHoldings, setUserHoldings] = useState({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('BUY');
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [tradeTotal, setTradeTotal] = useState(0);
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  // Timeframe options with period and interval
  const TIME_FRAMES = [
    { label: '1D', period: '1d', interval: '15m' },
    { label: '1W', period: '7d', interval: '1d' },
    { label: '1M', period: '1mo', interval: '1d' },
    { label: '3M', period: '3mo', interval: '1d' },
    { label: '1Y', period: '1y', interval: '1wk' },
    { label: '5Y', period: '5y', interval: '3mo' }
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch user's watchlist symbols
  const fetchWatchlistSymbols = async () => {
    try {
      const res = await axios.get(
        "https://stock-market-2-ybu3.onrender.com/api/account/watchlist/check/",
        { headers: getAuthHeaders() }
      );
      setWatchlistSymbols(res.data.symbols);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  // Add to watchlist
  const addToWatchlist = async () => {
    try {
      setAddingToWatchlist(true);
      await axios.post(
        "https://stock-market-2-ybu3.onrender.com/api/account/watchlist/",
        { 
          name: stockData.name,
          symbols: [symbol.replace('.NS','.NS').replace('.BO','.BO')]
        },
        { headers: getAuthHeaders() }
      );

      setWatchlistSymbols(prev => [...prev, symbol.replace('.NS','.NS').replace('.BO','.BO')]);
      alert(`(${symbol}) added to watchlist!`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      if (error.response?.status === 401) {
        alert("Please log in to add to watchlist.");
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to add to watchlist. Please try again.");
      }
    } finally {
      setAddingToWatchlist(false);
    }
  };

  // Fetch user holdings to check if they own this stock
  useEffect(() => {
    const fetchUserHoldings = async () => {
      try {
        const response = await axios.get(
          "https://stock-market-2-ybu3.onrender.com/portfolio/",
          { headers: getAuthHeaders() }
        );
        
        if (response.data) {
          const holdings = response.data;
          const currentStockHolding = holdings.find(h => 
            h.symbol === symbol.replace('.NS','.NS').replace('.BO','.BO')
          );
          
          setUserHoldings(currentStockHolding || {});
        }
      } catch (err) {
        console.error("Error fetching user holdings:", err);
      }
    };

    fetchUserHoldings();
    fetchWatchlistSymbols();
  }, [symbol]);

  const handleTradeClick = (type) => {
    setTradeType(type);
    setTradeQuantity(1);
    setTradeTotal(stockData.currentPrice);
    setShowTradeModal(true);
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    setTradeQuantity(qty);
    setTradeTotal(qty * stockData.currentPrice);
  };

  const executeTrade = async () => {
    try {
      const transactionData = {
        symbol: symbol.replace('.NS','.NS').replace('.BO','.BO'),
        quantity: tradeQuantity,
        price: parseFloat(Number(stockData.currentPrice).toFixed(2)),
        transaction_type: tradeType
      };

      const res = await axios.post(
        "https://stock-market-2-ybu3.onrender.com/api/account/transactions/",
        transactionData,
        { headers: getAuthHeaders() }
      );

      alert(res.data.message || `${tradeType} successful!`);
      setShowTradeModal(false);
      
      // Refresh user holdings after trade
      const response = await axios.get(
        "https://stock-market-2-ybu3.onrender.com/api/account/holdings/",
        { headers: getAuthHeaders() }
      );
      
      if (response.data && response.data.holdings) {
        const holdings = response.data.holdings;
        const currentStockHolding = holdings.find(h => 
          h.symbol === symbol.replace('.NS','.NS').replace('.BO','.BO')
        );
        
        setUserHoldings(currentStockHolding || {});
      }
    } catch (err) {
      console.error("Trade error:", err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Trade failed. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Find selected timeframe config
        const selectedTimeframe = TIME_FRAMES.find(tf => tf.label === timeframe);
        const period = selectedTimeframe.period;
        const interval = selectedTimeframe.interval;

        // Make API call with timeframe parameters
        const response = await axios.get(
          `https://stock-market-2-ybu3.onrender.com/api/stocks/${symbol}/`, 
          { params: { period, interval } }
        );

        const apiData = response.data.data || {};
        const history = apiData.history || [];

        // Transform data with proper fallbacks
        const transformedData = {
          symbol: apiData.symbol || symbol,
          name: apiData.companyName || apiData.longName || symbol,
          currentPrice: apiData.currentPrice || apiData.regularMarketPrice || 0,
          prevClose: apiData.previousClose || 0,
          open: apiData.open || 0,
          dayHigh: apiData.dayHigh || 0,
          dayLow: apiData.dayLow || 0,
          sector: apiData.sector || 'N/A',
          industry: apiData.industry || 'N/A',
          marketCap: apiData.marketCap || 0,
          peRatio: apiData.peRatio || apiData.trailingPE || 0,
          bookValue: apiData.bookValue || 0,
          high52Week: apiData.fiftyTwoWeekHigh || 0,
          low52Week: apiData.fiftyTwoWeekLow || 0,
          volume: apiData.volume || 0,
          avgVolume: apiData.averageVolume || 0,
          dividendYield: apiData.dividendYield || 0,
          about: apiData.longBusinessSummary || '',
          history: history
        };

        // Prepare chart data
        const formattedChartData = history.map(item => ({
          time: new Date(item.time).getTime(),
          close: item.close
        }));

        setStockData(transformedData);
        setChartData(formattedChartData);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
    } else {
      setError('No stock symbol provided');
      setLoading(false);
    }
  }, [symbol, timeframe]);

  // Calculate price change
  const getPriceChange = () => {
    if (!stockData || !stockData.prevClose) return { value: 0, percent: 0, isPositive: true };
    
    const changeValue = stockData.currentPrice - stockData.prevClose;
    const changePercent = (changeValue / stockData.prevClose) * 100;
    
    return {
      value: changeValue,
      percent: changePercent,
      isPositive: changeValue >= 0
    };
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 flex justify-center items-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
          <p>{error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl text-center">
          <p>No data available for {symbol}</p>
        </div>
      </div>
    );
  }

  const priceChange = getPriceChange();
  const ownsStock = userHoldings.quantity > 0;
  const isInWatchlist = watchlistSymbols.includes(symbol.replace('.NS','.NS').replace('.BO','.BO'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Trade Modal */}
        {showTradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">
                  {tradeType} {stockData.symbol.replace('.NS', '')}
                </h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowTradeModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-slate-700">
                    <span className="font-medium">Current Price:</span> ₹{stockData.currentPrice.toFixed(2)}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-2">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={tradeQuantity}
                    onChange={handleQuantityChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="border-t border-slate-200 pt-4 mb-6">
                  <p className="text-lg font-bold text-slate-900">
                    Total: ₹{tradeTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
                <button 
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={() => setShowTradeModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-all ${
                    tradeType === 'BUY'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                  onClick={executeTrade}
                >
                  Confirm {tradeType}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {stockData.name}{' '}
                <span className="text-xl text-slate-600">({stockData.symbol.replace('.NS', '')})</span>
              </h1>
            </div>
            
            {/* Add to Watchlist Button */}
            <div className="mt-4 md:mt-0">
              {isInWatchlist ? (
                <span className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-medium">
                  <Star className="w-5 h-5 mr-2" />
                  In Watchlist
                </span>
              ) : (
                <button 
                  onClick={addToWatchlist}
                  disabled={addingToWatchlist}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
                >
                  {addingToWatchlist ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Watchlist
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-slate-800">
              ₹{stockData.currentPrice.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              priceChange.isPositive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {priceChange.isPositive ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              ₹{Math.abs(priceChange.value).toFixed(2)} 
              ({Math.abs(priceChange.percent).toFixed(2)}%)
            </span>
            
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Building className="w-4 h-4 mr-1" />
              {stockData.sector}
            </span>
          </div>
          
          <div className="text-slate-600">
            {stockData.industry}
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">Price Chart</h2>
            <div className="flex flex-wrap gap-2">
              {TIME_FRAMES.map((tf) => (
                <button
                  key={tf.label}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeframe === tf.label
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => setTimeframe(tf.label)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(unixTime) => {
                      const date = new Date(unixTime);
                      if (timeframe === '1D') {
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }
                      return date.toLocaleDateString();
                    }}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `₹${value.toFixed(2)}`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(unixTime) => {
                      const date = new Date(unixTime);
                      return date.toLocaleString();
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Closing Price"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">No historical data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Trade Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Trade {stockData.symbol.replace('.NS', '')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              onClick={() => handleTradeClick("BUY")}
            >
              Buy
            </button>
            
            {ownsStock && (
              <button 
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
                onClick={() => handleTradeClick("SELL")}
              >
                Sell
              </button>
            )}
          </div>
          
          {ownsStock && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">
                <span className="font-medium">You own:</span> {userHoldings.quantity} shares
              </p>
              <p className="text-slate-700">
                <span className="font-medium">Avg. price:</span> ₹{userHoldings.average_price?.toFixed(2) || 'N/A'}
              </p>
            </div>
          )}
        </div>

        {/* Financial Metrics */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Previous Close</h3>
              <p className="text-lg font-semibold text-slate-800">
                ₹{stockData.prevClose.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Open</h3>
              <p className="text-lg font-semibold text-slate-800">
                ₹{stockData.open.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Day's Range</h3>
              <p className="text-lg font-semibold text-slate-800">
                ₹{stockData.dayLow.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ₹{stockData.dayHigh.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Market Cap</h3>
              <p className="text-lg font-semibold text-slate-800">
                {formatNumber(stockData.marketCap)}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">P/E Ratio</h3>
              <p className="text-lg font-semibold text-slate-800">
                {stockData.peRatio.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Book Value</h3>
              <p className="text-lg font-semibold text-slate-800">
                ₹{stockData.bookValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">52 Week Range</h3>
              <p className="text-lg font-semibold text-slate-800">
                ₹{stockData.low52Week.toLocaleString('en-IN')} - ₹{stockData.high52Week.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Volume</h3>
              <p className="text-lg font-semibold text-slate-800">
                {stockData.volume.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="text-slate-600 text-sm font-medium mb-2">Avg. Volume</h3>
              <p className="text-lg font-semibold text-slate-800">
                {stockData.avgVolume.toLocaleString('en-IN')}
              </p>
            </div>
            
            {stockData.dividendYield > 0 && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="text-slate-600 text-sm font-medium mb-2">Dividend Yield</h3>
                <p className="text-lg font-semibold text-slate-800">
                  {(stockData.dividendYield * 100).toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Company Description */}
        {stockData.about && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">About the Company</h2>
            <p className="text-slate-700 leading-relaxed">{stockData.about}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfo;