import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowUp, ArrowDown, Plus, Minus, X } from 'lucide-react';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('holdings');
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    symbol: '',
    transaction_type: 'BUY',
    quantity: 1,
    price: 0
  });

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchHoldings = async () => {
    try {
      const response = await axios.get(
        'https://stock-market-2-ybu3.onrender.com/api/account/portfolio/',
        { headers: getAuthHeaders() }
      );
      const holdingsData = Array.isArray(response.data.results) ? response.data.results : response.data;
      setHoldings(holdingsData);

      // Calculate totals
      const investment = holdingsData.reduce(
        (sum, holding) => sum + (holding.avg_price * holding.quantity), 0
      );
      const currentValue = holdingsData.reduce(
        (sum, holding) => sum + (holding.current_price * holding.quantity), 0
      );
      const profitLoss = currentValue - investment;

      setTotalInvestment(investment);
      setTotalCurrentValue(currentValue);
      setTotalProfitLoss(profitLoss);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      if (error.response?.status === 401) navigate('/');
    }
  };

  const fetchTransactions = async (url = 'https://stock-market-2-ybu3.onrender.com/api/account/transactions/history/') => {
    try {
      setLoading(true);
      const response = await axios.get(url, { headers: getAuthHeaders() });
      setTransactions(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPrice = async (symbol) => {
    try {
      const response = await axios.post(
        'https://stock-market-2-ybu3.onrender.com/api/account/watchlist/prices/',
        { symbols: [symbol] },
        { headers: getAuthHeaders() }
      );
      return response.data.prices[symbol] || 0;
    } catch (error) {
      console.error('Error fetching current price:', error);
      return 0;
    }
  };

  const handleTransaction = async () => {
    try {
      setLoading(true);
      await axios.post(
        'https://stock-market-2-ybu3.onrender.com/api/account/transactions/',
        {
          symbol: transactionModal.symbol,
          transaction_type: transactionModal.transaction_type,
          quantity: transactionModal.quantity,
          price: parseFloat(Number(transactionModal.price).toFixed(2)),
        },
        { headers: getAuthHeaders() }
      );

      // Refresh data
      await fetchHoldings();
      await fetchTransactions();
      setTransactionModal(prev => ({ ...prev, isOpen: false }));
      alert('Transaction successful!');
    } catch (error) {
      console.error("Transaction error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const openTransactionModal = async (symbol, transaction_type) => {
    const currentPrice = await fetchCurrentPrice(symbol);
    setTransactionModal({
      isOpen: true,
      symbol,
      transaction_type,
      quantity: 1,
      price: currentPrice
    });
  };

  useEffect(() => {
    fetchHoldings();
    fetchTransactions();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Track your investments and transaction history
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <h3 className="text-slate-600 mb-2">Total Investment</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalInvestment)}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <h3 className="text-slate-600 mb-2">Current Value</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalCurrentValue)}</p>
          </div>
          
          <div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center ${
            totalProfitLoss >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
          }`}>
            <h3 className="text-slate-600 mb-2">Profit/Loss</h3>
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfitLoss)}
              {totalProfitLoss !== 0 && (
                <span className="block text-sm font-normal mt-1">
                  ({((totalProfitLoss / totalInvestment) * 100).toFixed(2)}%)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === 'holdings' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setActiveTab('holdings')}
          >
            Current Holdings
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
        </div>

        {/* Transaction Modal */}
        {transactionModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">
                  {transactionModal.transaction_type} {transactionModal.symbol}
                </h3>
                <button 
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setTransactionModal(prev => ({ ...prev, isOpen: false }))}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-slate-700 font-medium mb-2">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={transactionModal.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTransactionModal(prev => ({
                        ...prev,
                        quantity: value === "" ? "" : Math.max(1, parseInt(value, 10) || 1)
                      }));
                    }}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <p className="text-slate-700">
                    <span className="font-medium">Current Price:</span> {formatCurrency(transactionModal.price)}
                  </p>
                </div>
                
                <div className="border-t border-slate-200 pt-4 mb-6">
                  <p className="text-lg font-bold text-slate-900">
                    Total: {formatCurrency(transactionModal.quantity * transactionModal.price)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
                <button 
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  onClick={() => setTransactionModal(prev => ({ ...prev, isOpen: false }))}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-all ${
                    transactionModal.transaction_type === 'BUY'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                  onClick={handleTransaction}
                >
                  Confirm {transactionModal.transaction_type}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holdings' ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Current Holdings</h2>
            </div>
            
            {holdings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Symbol</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Company</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Shares</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Avg Price</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Current Price</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Investment</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Current Value</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">P&L</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {holdings.map((holding) => {
                      const investment = holding.avg_price * holding.quantity;
                      const currentValue = holding.current_price * holding.quantity;
                      const profitLoss = 100 - investment;
                      const profitLossPercentage = investment > 0 ? (profitLoss / investment) * 100 : 0;

                      return (
                        <tr
                          key={holding.symbol}
                          onClick={() => navigate(`/stock/${holding.symbol}`)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-slate-800 font-medium">{holding.symbol}</td>
                          <td className="px-6 py-4 text-slate-700">{holding.company_name}</td>
                          <td className="px-6 py-4 text-slate-800">{holding.quantity}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(holding.avg_price)}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(holding.current_price)}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(investment)}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(currentValue)}</td>
                          <td className={`px-6 py-4 font-medium ${
                            profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(profitLoss)}
                            <br />
                            <span className="text-sm">
                              {profitLossPercentage.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              <button
                                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTransactionModal(holding.symbol, 'BUY');
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTransactionModal(holding.symbol, 'SELL');
                                }}
                                disabled={holding.quantity === 0}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">You don't have any holdings yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
            </div>
            
            {transactions.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Date</th>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Type</th>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Symbol</th>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Shares</th>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Price</th>
                        <th className="px-6 py-4 text-left text-slate-700 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-slate-700">{formatDate(txn.date)}</td>
                          <td className={`px-6 py-4 font-medium ${
                            txn.transaction_type === 'BUY' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {txn.transaction_type}
                          </td>
                          <td className="px-6 py-4 text-slate-800 font-medium">{txn.symbol}</td>
                          <td className="px-6 py-4 text-slate-800">{txn.quantity}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(txn.price)}</td>
                          <td className="px-6 py-4 text-slate-800">{formatCurrency(txn.quantity * txn.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center gap-3 p-6 border-t border-slate-200">
                  {prevPage && (
                    <button 
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      onClick={() => fetchTransactions(prevPage)}
                    >
                      Previous
                    </button>
                  )}
                  {nextPage && (
                    <button 
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      onClick={() => fetchTransactions(nextPage)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600">No transactions found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;