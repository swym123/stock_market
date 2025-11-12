
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./CompanyList.css";

// const CompanyList = () => {
//   const [companies, setCompanies] = useState([]);
//   const [nextPage, setNextPage] = useState(null);
//   const [prevPage, setPrevPage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [watchlistSymbols, setWatchlistSymbols] = useState([]);
//   const [showTradeModal, setShowTradeModal] = useState(false);
//   const [currentStock, setCurrentStock] = useState(null);
//   const [tradeQuantity, setTradeQuantity] = useState(1);
//   const [buying, setBuying] = useState(false);

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("access_token");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   // Fetch companies without caching
//   const fetchCompanies = async (url = "http://127.0.0.1:8000/api/companies/") => {
//     try {
//       setLoading(true);
//       const res = await axios.get(url, { headers: getAuthHeaders() });
//       setCompanies(res.data.results);
//       setNextPage(res.data.next);
//       setPrevPage(res.data.previous);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       if (error.response?.status === 401) {
//         alert("Session expired. Please log in again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user's watchlist symbols
//   const fetchWatchlistSymbols = async () => {
//     try {
//       const res = await axios.get(
//         "http://127.0.0.1:8000/api/account/watchlist/check/",
//         { headers: getAuthHeaders() }
//       );
//       setWatchlistSymbols(res.data.symbols);
//     } catch (error) {
//       console.error("Error fetching watchlist:", error);
//     }
//   };

//   // Add to watchlist
//   const addToWatchlist = async (symbol, companyName) => {
//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/account/watchlist/",
//         { 
//           name: companyName,
//           symbols: [symbol]
//         },
//         { headers: getAuthHeaders() }
//       );

//       setWatchlistSymbols(prev => [...prev, symbol]);
//       alert(`(${symbol}) added to watchlist!`);
//     } catch (error) {
//       console.error("Error adding to watchlist:", error);
//       if (error.response?.status === 401) {
//         alert("Please log in to add to watchlist.");
//       } else if (error.response?.data?.error) {
//         alert(error.response.data.error);
//       } else {
//         alert("Failed to add to watchlist. Please try again.");
//       }
//     }
//   };

//   // Handle buy button click
//   const handleBuyClick = (company, e) => {
//     e.stopPropagation();
//     setCurrentStock({
//       symbol: company.tradingsymbol,
//       name: company.name,
//       price: company.current_price || 0
//     });
//     setTradeQuantity(1);
//     setShowTradeModal(true);
//   };

//   // Execute buy transaction
//   const executeBuy = async () => {
//     try {
//       setBuying(true);

//       // Create transaction
//       const transactionData = {
//         symbol: currentStock.symbol,
//         quantity: tradeQuantity,
//         price: parseFloat(Number(currentStock.price).toFixed(2)),
//         transaction_type: "BUY"
//       };

//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/account/transactions/",
//         transactionData,
//         { headers: getAuthHeaders() }
//       );

//       alert(res.data.message || "Purchase successful!");
//       setShowTradeModal(false);

//     } catch (error) {
//       console.error("Error buying stock:", error.response?.data || error.message);

//       alert(
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         JSON.stringify(error.response?.data) ||
//         "Failed to complete purchase. Please try again."
//       );
//     } finally {
//       setBuying(false);
//     }
//   };

//   // Handle quantity change
//   const handleQuantityChange = (e) => {
//     const qty = parseInt(e.target.value) || 1;
//     setTradeQuantity(qty);
//   };

//   useEffect(() => {
//     fetchCompanies();
//     fetchWatchlistSymbols();
//   }, []);

//   return (
//     <div className="company-container">
//       <h1 className="company-title">Company List</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="company-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Symbol</th>
//               <th>Price</th>
//               <th>Change %</th>
//               <th>Watchlist</th>
//               <th>Trade</th>
//             </tr>
//           </thead>
//           <tbody>
//             {companies.map((company) => (
//               <tr key={company.id}>
//                 <td>{company.id}</td>
//                 <td>{company.name}</td>
//                 <td>{company.tradingsymbol}</td>
//                 <td>{company.current_price ?? "—"}</td>
//                 <td className={company.day_change_percent > 0 ? "price-up" : "price-down"}>
//                   {company.day_change_percent ?? "—"}%
//                 </td>
//                 <td>
//                   {watchlistSymbols.includes(company.tradingsymbol) ? (
//                     <span className="added-badge">⭐ Added</span>
//                   ) : (
//                     <button 
//                       onClick={() => addToWatchlist(company.tradingsymbol, company.name)}
//                       className="add-button"
//                     >
//                       Add to Watchlist
//                     </button>
//                   )}
//                 </td>
//                 <td>
//                   <button 
//                     onClick={(e) => handleBuyClick(company, e)}
//                     className="add-button"
//                     style={{ backgroundColor: "#2196F3" }}
//                   >
//                     Buy
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <div className="pagination">
//         <button onClick={() => fetchCompanies(prevPage)} disabled={!prevPage}>
//           Previous
//         </button>
//         <button onClick={() => fetchCompanies(nextPage)} disabled={!nextPage}>
//           Next
//         </button>
//       </div>

//       {/* Trade Modal */}
//       {showTradeModal && currentStock && (
//         <div className="trade-modal-overlay">
//           <div className="trade-modal">
//             <div className="trade-modal-header">
//               <h3>BUY {currentStock.symbol}</h3>
//               <button 
//                 className="close-modal"
//                 onClick={() => setShowTradeModal(false)}
//               >
//                 &times;
//               </button>
//             </div>
            
//             <div className="trade-modal-body">
//               <div className="trade-price-info">
//                 <p>Company: {currentStock.name}</p>
//                 <p>Current Price: ₹{currentStock.price.toFixed(2)}</p>
//               </div>
              
//               <div className="quantity-selector">
//                 <label htmlFor="quantity">Quantity:</label>
//                 <input
//                   type="number"
//                   id="quantity"
//                   min="1"
//                   value={tradeQuantity}
//                   onChange={handleQuantityChange}
//                 />
//               </div>
              
//               <div className="trade-total">
//                 <p>Total: ₹{(currentStock.price * tradeQuantity).toFixed(2)}</p>
//               </div>
//             </div>
            
//             <div className="trade-modal-footer">
//               <button 
//                 className="cancel-trade"
//                 onClick={() => setShowTradeModal(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="confirm-buy"
//                 onClick={executeBuy}
//                 disabled={buying}
//               >
//                 {buying ? "Processing..." : "Confirm BUY"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, Plus, Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";


const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchlistSymbols, setWatchlistSymbols] = useState([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch companies without caching
  const fetchCompanies = async (url = "https://stock-market-2-ybu3.onrender.com/api/companies/") => {
    try {
      setLoading(true);
      const res = await axios.get(url, { headers: getAuthHeaders() });
      setCompanies(res.data.results);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
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
  const addToWatchlist = async (symbol, companyName) => {
    try {
      await axios.post(
        "https://stock-market-2-ybu3.onrender.com/api/account/watchlist/",
        { 
          name: companyName,
          symbols: [symbol]
        },
        { headers: getAuthHeaders() }
      );

      setWatchlistSymbols(prev => [...prev, symbol]);
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
    }
  };

  // Handle buy button click
  const handleBuyClick = (company, e) => {
    e.stopPropagation();
    setCurrentStock({
      symbol: company.tradingsymbol,
      name: company.name,
      price: company.current_price || 0
    });
    setTradeQuantity(1);
    setShowTradeModal(true);
  };

  // Execute buy transaction
  const executeBuy = async () => {
    try {
      setBuying(true);

      // Create transaction
      const transactionData = {
        symbol: currentStock.symbol,
        quantity: tradeQuantity,
        price: parseFloat(Number(currentStock.price).toFixed(2)),
        transaction_type: "BUY"
      };

      const res = await axios.post(
        "https://stock-market-2-ybu3.onrender.com/api/account/transactions/",
        transactionData,
        { headers: getAuthHeaders() }
      );

      alert(res.data.message || "Purchase successful!");
      setShowTradeModal(false);

    } catch (error) {
      console.error("Error buying stock:", error.response?.data || error.message);

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to complete purchase. Please try again."
      );
    } finally {
      setBuying(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    setTradeQuantity(qty);
  };

  useEffect(() => {
    fetchCompanies();
    fetchWatchlistSymbols();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Company List
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore and trade stocks from various companies
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Symbol</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Change %</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Watchlist</th>
                    <th className="px-6 py-4 text-left text-slate-700 font-semibold">Trade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors hover:bg-slate-50 transition-colors cursor-pointer"    onClick={() => navigate(`/stock/${company.tradingsymbol}`)}>
                      <td className="px-6 py-4 text-slate-600">{company.id}</td>
                      <td className="px-6 py-4 text-slate-800 font-medium">{company.name}</td>
                      <td className="px-6 py-4 text-slate-700">{company.tradingsymbol}</td>
                      <td className="px-6 py-4 text-slate-800">{company.current_price ?? "—"}</td>
                      <td className={`px-6 py-4 font-medium ${company.day_change_percent > 0 ? "text-green-600" : "text-red-600"}`}>
                        {company.day_change_percent ?? "—"}%
                      </td>
                      <td className="px-6 py-4">
                        {watchlistSymbols.includes(company.tradingsymbol) ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-sm font-medium">
                            <Star className="w-4 h-4 mr-1" />
                            Added
                          </span>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); addToWatchlist(company.tradingsymbol, company.name)}}
                            className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add to Watchlist
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => handleBuyClick(company, e)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => fetchCompanies(prevPage)} 
            disabled={!prevPage}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button 
            onClick={() => fetchCompanies(nextPage)} 
            disabled={!nextPage}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

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
                  disabled={buying}
                >
                  {buying ? "Processing..." : "Confirm BUY"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
