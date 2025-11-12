
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, TrendingUp, Clock, ExternalLink, ArrowUp, ArrowDown } from "lucide-react"

const Home = () => {
  const [marketData, setMarketData] = useState(null)
  const [topStocks, setTopStocks] = useState({ gainers: [], losers: [] })
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMarketData()
    fetchTopStocks()
    fetchNews()
  }, [])

  const fetchMarketData = async () => {
    try {
      const response = await fetch('http://localhost:8000/StockIndex/market-data/')
      const data = await response.json()
      setMarketData(data)
    } catch (error) {
      console.error("Error fetching market data:", error)
    }
  }

  const fetchTopStocks = async () => {
    try {
      const response = await fetch('http://localhost:8000/StockIndex/top-stocks/')
      const data = await response.json()
      setTopStocks(data)
    } catch (error) {
      console.error("Error fetching top stocks:", error)
    }
  }

  const fetchNews = async (query = "") => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/news/?q=${query}`)
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      fetchNews(searchTerm)
    } else {
      fetchNews()
    }
  }

  // Format number with Indian comma separation
  const formatIndianNumber = (num) => {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Indian Stock Market Intelligence</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Track NSE and BSE stocks in real-time and manage portfolio
            </p>

            {/* Search Form */}
            {/* <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company (e.g. TCS, NIFTY, Reliance)"
                  className="w-full pl-12 pr-32 py-4 text-lg rounded-xl border-0 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{ right: 10, top: 10 }}
                  className="absolute right-2 top-  bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Search
                </motion.button>
              </div>
            </motion.form> */}
          </motion.div>
        </div>
      </section>

      {/* Market Data Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Market Overview</h2>
        
        {marketData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* NIFTY 50 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{marketData.nifty50.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatIndianNumber(marketData.nifty50.value)}
              </p>
              <div className={`flex items-center mt-2 ${marketData.nifty50.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.nifty50.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 font-medium">
                  {formatIndianNumber(Math.abs(marketData.nifty50.change))} ({Math.abs(marketData.nifty50.percent_change)}%)
                </span>
              </div>
            </motion.div>

            {/* SENSEX */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{marketData.sensex.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatIndianNumber(marketData.sensex.value)}
              </p>
              <div className={`flex items-center mt-2 ${marketData.sensex.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.sensex.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 font-medium">
                  {formatIndianNumber(Math.abs(marketData.sensex.change))} ({Math.abs(marketData.sensex.percent_change)}%)
                </span>
              </div>
            </motion.div>

            {/* NIFTY BANK */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{marketData.nifty_bank.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatIndianNumber(marketData.nifty_bank.value)}
              </p>
              <div className={`flex items-center mt-2 ${marketData.nifty_bank.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.nifty_bank.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 font-medium">
                  {formatIndianNumber(Math.abs(marketData.nifty_bank.change))} ({Math.abs(marketData.nifty_bank.percent_change)}%)
                </span>
              </div>
            </motion.div>

            {/* BSE MIDCAP */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
            >
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{marketData.bse_midcap.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {formatIndianNumber(marketData.bse_midcap.value)}
              </p>
              <div className={`flex items-center mt-2 ${marketData.bse_midcap.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketData.bse_midcap.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 font-medium">
                  {formatIndianNumber(Math.abs(marketData.bse_midcap.change))} ({Math.abs(marketData.bse_midcap.percent_change)}%)
                </span>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Top Gainers and Losers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Top Gainers */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-green-100 dark:bg-green-900/30 px-6 py-4">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-400">Top Gainers</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topStocks.gainers.length > 0 ? (
                topStocks.gainers.map((stock, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">₹{formatIndianNumber(stock.price)}</p>
                        <p className="text-green-600 font-medium flex items-center justify-end">
                          <ArrowUp size={14} className="mr-1" />
                          +{formatIndianNumber(stock.change)} ({stock.percent_change}%)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading gainers...
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Losers */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-red-100 dark:bg-red-900/30 px-6 py-4">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-400">Top Losers</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {topStocks.losers.length > 0 ? (
                topStocks.losers.map((stock, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">₹{formatIndianNumber(stock.price)}</p>
                        <p className="text-red-600 font-medium flex items-center justify-end">
                          <ArrowDown size={14} className="mr-1" />
                          {formatIndianNumber(stock.change)} ({stock.percent_change}%)
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Loading losers...
                </div>
              )}
            </div>
          </motion.div>
        </div>

           <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search company (e.g. TCS, NIFTY, Reliance)"
                  className="w-full pl-12 pr-32 py-4 text-lg rounded-xl border-0 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none shadow-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{ right: 10, top: 10 }}
                  className="absolute right-2 top-  bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Search
                </motion.button>
              </div>
            </motion.form>

        {/* News Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {searchTerm ? `News about ${searchTerm.toUpperCase()}` : "Latest Market News"}
            </h2>
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSearchTerm("")
                  fetchNews()
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Search
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Loading latest news...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {news.length > 0 ? (
                  news.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      {item.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.published}
                          </div>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Read More
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-20"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No news found</p>
                    <p className="text-gray-500 dark:text-gray-500">Try searching for a different company or topic</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  )
}

export default Home