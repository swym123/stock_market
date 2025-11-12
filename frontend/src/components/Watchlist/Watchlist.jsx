

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Plus, X, Trash2 } from "lucide-react";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prices, setPrices] = useState({});
  const [buying, setBuying] = useState({});
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Helper function to convert NSE symbol to Yahoo Finance format
  const toYahooSymbol = (symbol) => {
    if (!symbol.endsWith('.NS')) {
      return symbol + '.NS';
    }
    return symbol;
  };

  // Helper function to convert Yahoo symbol back to NSE format
  const toNseSymbol = (symbol) => {
    return symbol;
  };

  // Fetch user's watchlist
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/api/account/watchlist/",
        { headers: getAuthHeaders() }
      );
      
      console.log("API Response:", res.data);

      let items = [];
      
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        items = res.data.results;
      } else if (res.data && res.data.watchlist) {
        items = res.data.watchlist;
      } else if (res.data && typeof res.data === 'object') {
        items = [res.data];
      }

      const formattedItems = items.map(item => ({
        id: item.id || '',
        symbol: Array.isArray(item.symbols) && item.symbols.length > 0 ? toNseSymbol(item.symbols[0]) : '',
        name: item.name || '',
        current_price: item.current_price || 0,
        change_percent: item.change_percent || 0,
      }));

      setWatchlist(formattedItems);
      
      // Fetch prices for all symbols
      if (formattedItems.length > 0) {
        const symbols = formattedItems.map(item => toYahooSymbol(item.symbol));
        fetchPrices(symbols);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setError(error.response?.data?.message || "Failed to load watchlist. Please try again.");
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch current prices
  const fetchPrices = async (symbols) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/account/watchlist/prices/",
        { symbols },
        { headers: getAuthHeaders() }
      );
      
      if (res.data && res.data.prices) {
        // Convert Yahoo symbols back to NSE format for display
        const nsePrices = {};
        Object.keys(res.data.prices).forEach(yahooSymbol => {
          const nseSymbol = toNseSymbol(yahooSymbol);
          nsePrices[nseSymbol] = res.data.prices[yahooSymbol];
        });
        setPrices(nsePrices);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  // Handle buy button click
  const handleBuyClick = (stock, e) => {
    e.stopPropagation();
    setCurrentStock({
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      price: prices[stock.symbol] || 0
    });
    setTradeQuantity(1);
    setShowTradeModal(true);
  };

  // Execute buy transaction
  const executeBuy = async () => {
    try {
      setBuying(prev => ({ ...prev, [currentStock.symbol]: true }));

      // Create transaction
      const transactionData = {
        symbol: currentStock.symbol,
        quantity: tradeQuantity,
        price: parseFloat(Number(currentStock.price).toFixed(2)),
        transaction_type: "BUY"
      };

      const res = await axios.post(
        "http://127.0.0.1:8000/api/account/transactions/",
        transactionData,
        { headers: getAuthHeaders() }
      );

      alert(res.data.message || "Purchase successful!");
      setShowTradeModal(false);

      // Refresh the user's balance and portfolio
      fetchWatchlist();

    } catch (error) {
      console.error("Error buying stock:", error.response?.data || error.message);

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to complete purchase. Please try again."
      );
    } finally {
      setBuying(prev => ({ ...prev, [currentStock.symbol]: false }));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    setTradeQuantity(qty);
  };

  // Remove from watchlist
  const removeFromWatchlist = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/account/watchlist/${id}/`,
        { headers: getAuthHeaders() }
      );
      setWatchlist(prev => prev.filter(item => item.id !== id));
      alert("Successfully removed from watchlist");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert(error.response?.data?.message || "Failed to remove from watchlist. Please try again.");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

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
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Watchlist
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Track your favorite stocks and manage your investments
          </p>
        </div>
        
        {watchlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <p className="text-slate-600 text-lg">Your watchlist is empty. Add some stocks from the company list!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Symbol</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Company Name</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Current Price (₹)</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Change %</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {watchlist.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => navigate(`/stock/${item.symbol}`)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-slate-800 font-medium">{item.symbol}</td>
                      <td className="px-6 py-4 text-slate-700">{item.name}</td>
                      <td className="px-6 py-4 text-slate-800">
                        {prices[item.symbol] ? (
                          `₹${prices[item.symbol].toFixed(2)}`
                        ) : (
                          "Loading..."
                        )}
                      </td>
                      <td className={`px-6 py-4 font-medium ${item.change_percent >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.change_percent.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => handleBuyClick(item, e)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium text-sm"
                            disabled={!prices[item.symbol]}
                          >
                            Buy
                          </button>
                          <button 
                            onClick={(e) => removeFromWatchlist(item.id, e)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trade Modal */}
        {showTradeModal && currentStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">BUY {currentStock.symbol}</h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowTradeModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-slate-700 mb-1">Company: {currentStock.name}</p>
                  <p className="text-slate-700 font-medium">Current Price: ₹{currentStock.price.toFixed(2)}</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-slate-700 font-medium mb-2">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={tradeQuantity}
                    onChange={handleQuantityChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="border-t border-slate-200 pt-4 mb-6">
                  <p className="text-lg font-bold text-slate-900">Total: ₹{(currentStock.price * tradeQuantity).toFixed(2)}</p>
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
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
                  onClick={executeBuy}
                  disabled={buying[currentStock.symbol]}
                >
                  {buying[currentStock.symbol] ? "Processing..." : "Confirm BUY"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
