// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import { Search, User, LogOut, TrendingUp } from "lucide-react"
// import "./Navbar.css"
// import { getProfile } from "../../api"
// import { useNavigate } from "react-router-dom";


// const Navbar = () => {
//   // Search state
//   const [searchQuery, setSearchQuery] = useState("")
//   const [suggestions, setSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const navigate = useNavigate();

//   // Auth state
//   const [showAuthModal, setShowAuthModal] = useState(false)
//   const [isLogin, setIsLogin] = useState(true)
//   const [authData, setAuthData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   })
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user")
//     return savedUser ? JSON.parse(savedUser) : null
//   })
//   const [authError, setAuthError] = useState("")
//   const [showUserDropdown, setShowUserDropdown] = useState(false)

//   // Search suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (searchQuery.length > 1) {
//         try {
//           const response = await axios.get("http://127.0.0.1:8000/api/search/", { params: { q: searchQuery } })
//           setSuggestions(response.data)
//           setShowSuggestions(true)
//         } catch (error) {
//           console.error("Error fetching suggestions:", error)
//         }
//       } else {
//         setSuggestions([])
//         setShowSuggestions(false)
//       }
//     }

//     const timer = setTimeout(() => {
//       fetchSuggestions()
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [searchQuery])

//   const handleAuthChange = (e) => {
//     setAuthData({ ...authData, [e.target.name]: e.target.value })
//     setAuthError("")
//   }

//   const handleAuthSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (isLogin) {
//         const response = await axios.post("http://127.0.0.1:8000/api/account/login/", {
//           username: authData.name,
//           password: authData.password,
//         })

//         if (response.data.error) {
//           throw new Error(response.data.error)
//         }

//         localStorage.setItem("access_token", response.data.tokens.access)
//         localStorage.setItem("refresh_token", response.data.tokens.refresh)

//         const profile = await getProfile()
//         const userData = {
//           username: profile.username,
//           email: profile.email,
//           phone: profile.phone || null,
//         }

//         setUser(userData)
//         localStorage.setItem("user", JSON.stringify(userData))
//         localStorage.setItem("userProfile", JSON.stringify(userData))

//         setShowAuthModal(false)
//         setAuthData({ name: "", email: "", password: "" })
//       } else {
//         const response = await axios.post("http://127.0.0.1:8000/api/account/signup/", {
//           username: authData.name,
//           email: authData.email,
//           password: authData.password,
//         })

//         if (response.data.error) {
//           throw new Error(response.data.error)
//         }

//         localStorage.setItem("access_token", response.data.tokens.access)
//         localStorage.setItem("refresh_token", response.data.tokens.refresh)

//         const userData = {
//           username: response.data.user.username,
//           email: response.data.user.email,
//           phone: response.data.user.phone || null,
//         }

//         setUser(userData)
//         localStorage.setItem("user", JSON.stringify(userData))
//         localStorage.setItem("userProfile", JSON.stringify(userData))

//         setShowAuthModal(false)
//         setAuthData({ name: "", email: "", password: "" })
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || error.message || "Authentication failed. Please try again."

//       setAuthError(errorMessage)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/account/logout/",
//         {
//           refresh_token: localStorage.getItem("refresh_token"),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         },
//       )
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       localStorage.removeItem("access_token")
//       localStorage.removeItem("refresh_token")
//       localStorage.removeItem("user")
//       localStorage.removeItem("userProfile")
//       setUser(null)
//       setShowUserDropdown(false)
//     }
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()

//     const matched = suggestions.find((company) => company.tradingsymbol.toLowerCase() === searchQuery.toLowerCase())

//     if (matched) {
//       window.location.href = `/stock/${matched.tradingsymbol}`
//     } else if (suggestions.length > 0) {
//       const first = suggestions[0]
//       setSearchQuery(first.tradingsymbol)
//       window.location.href = `/stock/${first.tradingsymbol}`
//     } else {
//       console.log("No valid suggestion found. Not searching.")
//     }

//     setShowSuggestions(false)
//   }

//   const handleSuggestionClick = (company) => {
//     setSearchQuery(company.tradingsymbol)
//     setShowSuggestions(false)
//     window.location.href = `/stock/${company.tradingsymbol}`
//   }

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Brand */}
//             <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
//               <TrendingUp className="h-8 w-8 text-blue-600" />
//               <span className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate("/")}>StockMarket</span>
//             </motion.div>

//             {/* Search */}
//             <div className="flex-1 max-w-lg mx-8 relative">
//               <form onSubmit={handleSearch} className="relative">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search companies..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
//                     onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//                   />
//                 </div>

//                 <AnimatePresence>
//                   {showSuggestions && suggestions.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
//                     >
//                       {suggestions.map((company) => (
//                         <motion.div
//                           key={company.id}
//                           whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
//                           className="px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
//                           onClick={() => handleSuggestionClick(company)}
//                         >
//                           <div className="font-medium text-gray-900 dark:text-white">{company.tradingsymbol}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400">{company.name}</div>
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </form>
//             </div>

//             {/* Navigation Links */}
//             <div className="hidden md:flex items-center space-x-6">
//               <a
//                 href="/"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Home
//               </a>
//               <a
//                 href="/companies"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Stocks
//               </a>
//               <a
//                 href="/watchlist"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Watchlist
//               </a>
//               <a
//                 href="/portfolio"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Portfolio
//               </a>

//               {user ? (
//                 <div className="relative">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowUserDropdown(!showUserDropdown)}
//                     className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                       <span className="text-white text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
//                     </div>
//                     <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
//                   </motion.button>

//                   <AnimatePresence>
//                     {showUserDropdown && (
//                       <motion.div
//                         initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                         animate={{ opacity: 1, scale: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                         className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
//                       >
//                         <a
//                           href="/profile"
//                           className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                         >
//                           <User className="h-4 w-4 mr-2" />
//                           Profile
//                         </a>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                         >
//                           <LogOut className="h-4 w-4 mr-2" />
//                           Logout
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => {
//                     setShowAuthModal(true)
//                     setIsLogin(true)
//                     setAuthError("")
//                   }}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Login
//                 </motion.button>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       <AnimatePresence>
//         {showAuthModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={() => setShowAuthModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {isLogin ? "Welcome Back" : "Create Account"}
//                 </h2>
//                 <button
//                   onClick={() => setShowAuthModal(false)}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               {authError && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4"
//                 >
//                   {authError}
//                 </motion.div>
//               )}

//               <form onSubmit={handleAuthSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={authData.name}
//                     onChange={handleAuthChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 {!isLogin && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={authData.email}
//                       onChange={handleAuthChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={authData.password}
//                     onChange={handleAuthChange}
//                     required
//                     minLength="4"
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
//                 >
//                   {isLogin ? "Sign In" : "Create Account"}
//                 </motion.button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-gray-600 dark:text-gray-400">
//                   {isLogin ? "Don't have an account? " : "Already have an account? "}
//                   <button
//                     onClick={() => {
//                       setIsLogin(!isLogin)
//                       setAuthError("")
//                     }}
//                     className="text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     {isLogin ? "Sign Up" : "Sign In"}
//                   </button>
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default Navbar

// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { motion, AnimatePresence } from "framer-motion"
// import { Search, User, LogOut, TrendingUp, AlertCircle } from "lucide-react"
// import "./Navbar.css"
// import { getProfile } from "../../api"
// import { useNavigate } from "react-router-dom"

// const Navbar = () => {
//   // Search state
//   const [searchQuery, setSearchQuery] = useState("")
//   const [suggestions, setSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const navigate = useNavigate();

//   // Auth state
//   const [showAuthModal, setShowAuthModal] = useState(false)
//   const [isLogin, setIsLogin] = useState(true)
//   const [authData, setAuthData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   })
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user")
//     return savedUser ? JSON.parse(savedUser) : null
//   })
//   const [authError, setAuthError] = useState("")
//   const [showUserDropdown, setShowUserDropdown] = useState(false)

//   // Search suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (searchQuery.length > 1) {
//         try {
//           const response = await axios.get("http://127.0.0.1:8000/api/search/", { params: { q: searchQuery } })
//           setSuggestions(response.data)
//           setShowSuggestions(true)
//         } catch (error) {
//           console.error("Error fetching suggestions:", error)
//         }
//       } else {
//         setSuggestions([])
//         setShowSuggestions(false)
//       }
//     }

//     const timer = setTimeout(() => {
//       fetchSuggestions()
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [searchQuery])

//   const handleAuthChange = (e) => {
//     setAuthData({ ...authData, [e.target.name]: e.target.value })
//     setAuthError("")
//   }

//   // Function to handle different types of authentication errors
//   const handleAuthError = (error) => {
//     if (error.response) {
//       // Server responded with error status
//       const { status, data } = error.response;
      
//       if (status === 400) {
//         if (data.errors) {
//           // Handle field validation errors
//           const errorMessages = Object.values(data.errors).flat();
//           return errorMessages.join(" ");
//         } else if (data.error) {
//           return data.error;
//         } else if (data.detail) {
//           return data.detail;
//         } else if (data.non_field_errors) {
//           return data.non_field_errors.join(" ");
//         }
//         return "Invalid request. Please check your input.";
//       } else if (status === 401) {
//         return "Invalid username or password.";
//       } else if (status === 403) {
//         return "You don't have permission to perform this action.";
//       } else if (status === 404) {
//         return "User does not exist.";
//       } else if (status >= 500) {
//         return "Server error. Please try again later.";
//       }
//     } else if (error.request) {
//       // Request was made but no response received
//       return "Network error. Please check your connection.";
//     } else {
//       // Something else happened
//       return error.message || "Authentication failed. Please try again.";
//     }
    
//     return "An unexpected error occurred.";
//   }

//   const handleAuthSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       if (isLogin) {
//         const response = await axios.post("http://127.0.0.1:8000/api/account/login/", {
//           username: authData.name,
//           password: authData.password,
//         })

//         if (response.data.error) {
//           throw new Error(response.data.error)
//         }

//         localStorage.setItem("access_token", response.data.tokens.access)
//         localStorage.setItem("refresh_token", response.data.tokens.refresh)

//         const profile = await getProfile()
//         const userData = {
//           username: profile.username,
//           email: profile.email,
//           phone: profile.phone || null,
//         }

//         setUser(userData)
//         localStorage.setItem("user", JSON.stringify(userData))
//         localStorage.setItem("userProfile", JSON.stringify(userData))

//         setShowAuthModal(false)
//         setAuthData({ name: "", email: "", password: "" })
//       } else {
//         const response = await axios.post("http://127.0.0.1:8000/api/account/signup/", {
//           username: authData.name,
//           email: authData.email,
//           password: authData.password,
//         })

//         if (response.data.error) {
//           throw new Error(response.data.error)
//         }

//         localStorage.setItem("access_token", response.data.tokens.access)
//         localStorage.setItem("refresh_token", response.data.tokens.refresh)

//         const userData = {
//           username: response.data.user.username,
//           email: response.data.user.email,
//           phone: response.data.user.phone || null,
//         }

//         setUser(userData)
//         localStorage.setItem("user", JSON.stringify(userData))
//         localStorage.setItem("userProfile", JSON.stringify(userData))

//         setShowAuthModal(false)
//         setAuthData({ name: "", email: "", password: "" })
//       }
//     } catch (error) {
//       const errorMessage = handleAuthError(error)
//       setAuthError(errorMessage)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/account/logout/",
//         {
//           refresh_token: localStorage.getItem("refresh_token"),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         },
//       )
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       localStorage.removeItem("access_token")
//       localStorage.removeItem("refresh_token")
//       localStorage.removeItem("user")
//       localStorage.removeItem("userProfile")
//       setUser(null)
//       setShowUserDropdown(false)
//     }
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()

//     const matched = suggestions.find((company) => company.tradingsymbol.toLowerCase() === searchQuery.toLowerCase())

//     if (matched) {
//       navigate(`/stock/${matched.tradingsymbol}`)
//     } else if (suggestions.length > 0) {
//       const first = suggestions[0]
//       setSearchQuery(first.tradingsymbol)
//       navigate(`/stock/${first.tradingsymbol}`)
//     } else {
//       console.log("No valid suggestion found. Not searching.")
//     }

//     setShowSuggestions(false)
//   }

//   const handleSuggestionClick = (company) => {
//     setSearchQuery(company.tradingsymbol)
//     setShowSuggestions(false)
//     navigate(`/stock/${company.tradingsymbol}`)
//   }

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Brand */}
//             <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
//               <TrendingUp className="h-8 w-8 text-blue-600" />
//               <span className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate("/")}>StockMarket</span>
//             </motion.div>

//             {/* Search */}
//             <div className="flex-1 max-w-lg mx-8 relative">
//               <form onSubmit={handleSearch} className="relative">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search companies..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
//                     onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//                   />
//                 </div>

//                 <AnimatePresence>
//                   {showSuggestions && suggestions.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -10 }}
//                       className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
//                     >
//                       {suggestions.map((company) => (
//                         <motion.div
//                           key={company.id}
//                           whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
//                           className="px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
//                           onClick={() => handleSuggestionClick(company)}
//                         >
//                           <div className="font-medium text-gray-900 dark:text-white">{company.tradingsymbol}</div>
//                           <div className="text-sm text-gray-500 dark:text-gray-400">{company.name}</div>
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </form>
//             </div>

//             {/* Navigation Links */}
//             <div className="hidden md:flex items-center space-x-6">
//               <a
//                 href="/"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Home
//               </a>
//               <a
//                 href="/companies"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Stocks
//               </a>
//               <a
//                 href="/watchlist"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Watchlist
//               </a>
//               <a
//                 href="/portfolio"
//                 className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
//               >
//                 Portfolio
//               </a>

//               {user ? (
//                 <div className="relative">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setShowUserDropdown(!showUserDropdown)}
//                     className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                       <span className="text-white text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
//                     </div>
//                     <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
//                   </motion.button>

//                   <AnimatePresence>
//                     {showUserDropdown && (
//                       <motion.div
//                         initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                         animate={{ opacity: 1, scale: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                         className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
//                       >
//                         <a
//                           href="/profile"
//                           className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                         >
//                           <User className="h-4 w-4 mr-2" />
//                           Profile
//                         </a>
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                         >
//                           <LogOut className="h-4 w-4 mr-2" />
//                           Logout
//                         </button>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => {
//                     setShowAuthModal(true)
//                     setIsLogin(true)
//                     setAuthError("")
//                   }}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Login
//                 </motion.button>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       <AnimatePresence>
//         {showAuthModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={() => setShowAuthModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {isLogin ? "Welcome Back" : "Create Account"}
//                 </h2>
//                 <button
//                   onClick={() => setShowAuthModal(false)}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>

//               {authError && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-start"
//                 >
//                   <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//                   <span>{authError}</span>
//                 </motion.div>
//               )}

//               <form onSubmit={handleAuthSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={authData.name}
//                     onChange={handleAuthChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 {!isLogin && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={authData.email}
//                       onChange={handleAuthChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={authData.password}
//                     onChange={handleAuthChange}
//                     required
//                     minLength="4"
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
//                 >
//                   {isLogin ? "Sign In" : "Create Account"}
//                 </motion.button>
//               </form>

//               <div className="mt-6 text-center">
//                 <p className="text-gray-600 dark:text-gray-400">
//                   {isLogin ? "Don't have an account? " : "Already have an account? "}
//                   <button
//                     onClick={() => {
//                       setIsLogin(!isLogin)
//                       setAuthError("")
//                     }}
//                     className="text-blue-600 hover:text-blue-700 font-medium"
//                   >
//                     {isLogin ? "Sign Up" : "Sign In"}
//                   </button>
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default Navbar


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, LogOut, TrendingUp, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import "./Navbar.css"
import { getProfile } from "../../api"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate();

  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [authError, setAuthError] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Password validation criteria
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Username validation criteria
  const [usernameCriteria, setUsernameCriteria] = useState({
    minLength: false,
    maxLength: false,
    validChars: false,
  })

  // Email validation state
  const [isEmailValid, setIsEmailValid] = useState(false)

  // Search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/search/", { params: { q: searchQuery } })
          setSuggestions(response.data)
          setShowSuggestions(true)
        } catch (error) {
          console.error("Error fetching suggestions:", error)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const timer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Validate email format
  useEffect(() => {
    if (authData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsEmailValid(emailRegex.test(authData.email))
    } else {
      setIsEmailValid(false)
    }
  }, [authData.email])

  // Validate password criteria
  useEffect(() => {
    if (authData.password) {
      setPasswordCriteria({
        minLength: authData.password.length >= 8,
        hasUppercase: /[A-Z]/.test(authData.password),
        hasLowercase: /[a-z]/.test(authData.password),
        hasNumber: /[0-9]/.test(authData.password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(authData.password),
      })
    } else {
      setPasswordCriteria({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      })
    }
  }, [authData.password])

  // Validate username criteria
  useEffect(() => {
    if (authData.name) {
      setUsernameCriteria({
        minLength: authData.name.length >= 3,
        maxLength: authData.name.length <= 20,
        validChars: /^[a-zA-Z0-9_]+$/.test(authData.name),
      })
    } else {
      setUsernameCriteria({
        minLength: false,
        maxLength: false,
        validChars: false,
      })
    }
  }, [authData.name])

  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value })
    setAuthError("")
    setValidationErrors({})
  }

  // Function to handle different types of authentication errors
  const handleAuthError = (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 400) {
        if (data.errors) {
          // Handle field validation errors
          const errorMessages = Object.values(data.errors).flat();
          return errorMessages.join(" ");
        } else if (data.error) {
          return data.error;
        } else if (data.detail) {
          return data.detail;
        } else if (data.non_field_errors) {
          return data.non_field_errors.join(" ");
        } else if (data.username) {
          return `Username: ${data.username.join(" ")}`;
        } else if (data.email) {
          return `Email: ${data.email.join(" ")}`;
        } else if (data.password) {
          return `Password: ${data.password.join(" ")}`;
        }
        return "Invalid request. Please check your input.";
      } else if (status === 401) {
        return "Invalid username or password.";
      } else if (status === 403) {
        return "You don't have permission to perform this action.";
      } else if (status === 404) {
        return "User does not exist.";
      } else if (status === 409) {
        return "User with this username or email already exists.";
      } else if (status >= 500) {
        return "Server error. Please try again later.";
      }
    } else if (error.request) {
      // Request was made but no response received
      return "Network error. Please check your connection.";
    } else {
      // Something else happened
      return error.message || "Authentication failed. Please try again.";
    }
    
    return "An unexpected error occurred.";
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!isLogin) {
      // Registration validation
      if (!authData.name.trim()) {
        errors.name = "Username is required";
      } else if (!usernameCriteria.minLength) {
        errors.name = "Username must be at least 3 characters";
      } else if (!usernameCriteria.maxLength) {
        errors.name = "Username must be less than 20 characters";
      } else if (!usernameCriteria.validChars) {
        errors.name = "Username can only contain letters, numbers, and underscores";
      }
      
      if (!authData.email.trim()) {
        errors.email = "Email is required";
      } else if (!isEmailValid) {
        errors.email = "Please enter a valid email address";
      }
    } else {
      // Login validation
      if (!authData.name.trim()) {
        errors.name = "Username is required";
      }
    }
    
    if (!authData.password.trim()) {
      errors.password = "Password is required";
    } else if (!isLogin && !Object.values(passwordCriteria).every(criterion => criterion)) {
      errors.password = "Password does not meet all requirements";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true)
    
    try {
      if (isLogin) {
        const response = await axios.post("http://127.0.0.1:8000/api/account/login/", {
          username: authData.name,
          password: authData.password,
        })

        if (response.data.error) {
          throw new Error(response.data.error)
        }

        localStorage.setItem("access_token", response.data.tokens.access)
        localStorage.setItem("refresh_token", response.data.tokens.refresh)

        const profile = await getProfile()
        const userData = {
          username: profile.username,
          email: profile.email,
          phone: profile.phone || null,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("userProfile", JSON.stringify(userData))

        setShowAuthModal(false)
        setAuthData({ name: "", email: "", password: "" })
        setAuthError("")
      } else {
        const response = await axios.post("http://127.0.0.1:8000/api/account/signup/", {
          username: authData.name,
          email: authData.email,
          password: authData.password,
        })

        if (response.data.error) {
          throw new Error(response.data.error)
        }

        localStorage.setItem("access_token", response.data.tokens.access)
        localStorage.setItem("refresh_token", response.data.tokens.refresh)

        const userData = {
          username: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phone || null,
        }

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("userProfile", JSON.stringify(userData))

        setShowAuthModal(false)
        setAuthData({ name: "", email: "", password: "" })
        setAuthError("")
      }
    } catch (error) {
      const errorMessage = handleAuthError(error)
      setAuthError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/account/logout/",
        {
          refresh_token: localStorage.getItem("refresh_token"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user")
      localStorage.removeItem("userProfile")
      setUser(null)
      setShowUserDropdown(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    const matched = suggestions.find((company) => company.tradingsymbol.toLowerCase() === searchQuery.toLowerCase())

    if (matched) {
      navigate(`/stock/${matched.tradingsymbol}`)
    } else if (suggestions.length > 0) {
      const first = suggestions[0]
      setSearchQuery(first.tradingsymbol)
      navigate(`/stock/${first.tradingsymbol}`)
    } else {
      console.log("No valid suggestion found. Not searching.")
    }

    setShowSuggestions(false)
  }

  const handleSuggestionClick = (company) => {
    setSearchQuery(company.tradingsymbol)
    setShowSuggestions(false)
    navigate(`/stock/${company.tradingsymbol}`)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate("/")}>StockMarket</span>
            </motion.div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8 relative">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                    >
                      {suggestions.map((company) => (
                        <motion.div
                          key={company.id}
                          whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                          className="px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => handleSuggestionClick(company)}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{company.tradingsymbol}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{company.name}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Home
              </a>
              <a
                href="/companies"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Stocks
              </a>
              <a
                href="/watchlist"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Watchlist
              </a>
              <a
                href="/portfolio"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Portfolio
              </a>

              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                      >
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsLogin(true)
                    setAuthError("")
                    setValidationErrors({})
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 flex items-start"
                >
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{authError}</span>
                </motion.div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                    {!isLogin && (
                      <span className="ml-1 text-xs text-gray-500">
                        (3-20 characters, letters, numbers, and underscores only)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={authData.name}
                    onChange={handleAuthChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      validationErrors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                  )}
                  
                  {!isLogin && authData.name && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        {usernameCriteria.minLength ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={usernameCriteria.minLength ? "text-green-600" : "text-gray-500"}>
                          At least 3 characters
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {usernameCriteria.maxLength ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={usernameCriteria.maxLength ? "text-green-600" : "text-gray-500"}>
                          Maximum 20 characters
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {usernameCriteria.validChars ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={usernameCriteria.validChars ? "text-green-600" : "text-gray-500"}>
                          Only letters, numbers, and underscores
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={authData.email}
                      onChange={handleAuthChange}
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        validationErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                    )}
                    {authData.email && (
                      <div className="mt-1 flex items-center text-xs">
                        {isEmailValid ? (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-600">Valid email format</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-500 mr-1" />
                            <span className="text-red-600">Invalid email format</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                    {!isLogin && (
                      <span className="ml-1 text-xs text-gray-500">(Must meet all requirements below)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={authData.password}
                      onChange={handleAuthChange}
                      required
                      minLength="8"
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        validationErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                  )}
                  
                  {!isLogin && authData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs">
                        {passwordCriteria.minLength ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={passwordCriteria.minLength ? "text-green-600" : "text-gray-500"}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordCriteria.hasUppercase ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={passwordCriteria.hasUppercase ? "text-green-600" : "text-gray-500"}>
                          Contains uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordCriteria.hasLowercase ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={passwordCriteria.hasLowercase ? "text-green-600" : "text-gray-500"}>
                          Contains lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordCriteria.hasNumber ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={passwordCriteria.hasNumber ? "text-green-600" : "text-gray-500"}>
                          Contains number
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {passwordCriteria.hasSpecialChar ? (
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={passwordCriteria.hasSpecialChar ? "text-green-600" : "text-gray-500"}>
                          Contains special character
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setAuthError("")
                      setValidationErrors({})
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar