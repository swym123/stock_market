// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { motion, AnimatePresence } from "framer-motion"
// import { User, Mail, Phone, Shield, DollarSign, Plus, AlertCircle, CheckCircle, Loader } from "lucide-react"


// const ProfilePage = () => {
//   const navigate = useNavigate()
//   const [userData, setUserData] = useState(() => {
//     const savedUser = localStorage.getItem("user")
//     return savedUser
//       ? JSON.parse(savedUser)
//       : {
//           username: "",
//           email: "",
//           phone: "",
//           account_type: "DEMO",
//           risk_profile: "MEDIUM",
//           balance: "0.00",
//         }
//   })

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [successMessage, setSuccessMessage] = useState("")
//   const [addFundsAmount, setAddFundsAmount] = useState("")
//   const [isAddingFunds, setIsAddingFunds] = useState(false)
//   const [formErrors, setFormErrors] = useState({})
//   const [showAddFundsModal, setShowAddFundsModal] = useState(false)

//   const updateLocalStorageUser = (userData) => {
//     localStorage.setItem(
//       "user",
//       JSON.stringify({
//         username: userData.username,
//         email: userData.email,
//         phone: userData.phone,
//         account_type: userData.account_type,
//         risk_profile: userData.risk_profile,
//         balance: userData.balance,
//       }),
//     )
//   }

//   const fetchProfile = async () => {
//     setIsLoading(true)
//     setError("")

//     try {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         throw new Error("Authentication token not found. Please log in again.")
//       }

//       const response = await fetch("http://localhost:8000/api/account/profile/", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         credentials: "include",
//       })

//       if (response.status === 401) {
//         localStorage.removeItem("access_token")
//         localStorage.removeItem("user")
//         navigate("/")
//         return
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.detail || errorData.message || `Server responded with status ${response.status}`)
//       }

//       const data = await response.json()
//       const updatedUserData = {
//         username: data.username || "",
//         email: data.email || "",
//         phone: data.phone || "",
//         account_type: data.account_type || "DEMO",
//         risk_profile: data.risk_profile || "MEDIUM",
//         balance: data.balance || "0.00",
//       }

//       setUserData(updatedUserData)
//       updateLocalStorageUser(updatedUserData)
//     } catch (error) {
//       console.error("Fetch profile error:", error)
//       setError(error.message || "Failed to fetch profile data")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProfile()
//   }, [])

//   const validateProfile = () => {
//     const errors = {}

//     if (!userData.username || userData.username.length < 3) {
//       errors.username = "Username must be at least 3 characters"
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(userData.email)) {
//       errors.email = "Please enter a valid email address"
//     }

//     if (userData.phone && userData.phone.length < 10) {
//       errors.phone = "Phone number must be at least 10 digits"
//     }

//     return errors
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setUserData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: "" }))
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")
//     setSuccessMessage("")

//     const errors = validateProfile()
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       setError("Please fix the form errors")
//       return
//     }

//     try {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         throw new Error("Authentication token not found. Please log in again.")
//       }

//       const response = await fetch("http://localhost:8000/api/account/profile/", {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           username: userData.username,
//           email: userData.email,
//           phone: userData.phone,
//           account_type: userData.account_type,
//           risk_profile: userData.risk_profile,
//         }),
//       })

//       if (response.status === 401) {
//         localStorage.removeItem("access_token")
//         localStorage.removeItem("user")
//         navigate("/")
//         return
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.detail || errorData.message || `Server responded with status ${response.status}`)
//       }

//       const data = await response.json()
//       const updatedUserData = {
//         username: data.username || userData.username,
//         email: data.email || userData.email,
//         phone: data.phone || userData.phone,
//         account_type: data.account_type || userData.account_type,
//         risk_profile: data.risk_profile || userData.risk_profile,
//         balance: data.balance || userData.balance,
//       }

//       setUserData(updatedUserData)
//       updateLocalStorageUser(updatedUserData)
//       setSuccessMessage("Profile updated successfully!")
//     } catch (error) {
//       console.error("Update profile error:", error)
//       setError(error.message || "Failed to update profile")
//     }
//   }

//   const handleAddFunds = async () => {
//     if (!addFundsAmount || Number.parseFloat(addFundsAmount) <= 0) {
//       setError("Please enter a valid amount")
//       return
//     }

//     setIsAddingFunds(true)
//     setError("")
//     setSuccessMessage("")

//     try {
//       const token = localStorage.getItem("access_token")
//       if (!token) {
//         throw new Error("Authentication token not found. Please log in again.")
//       }

//       const response = await fetch("http://localhost:8000/api/account/add_funds/", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({ amount: addFundsAmount }),
//       })

//       if (response.status === 401) {
//         localStorage.removeItem("access_token")
//         localStorage.removeItem("user")
//         navigate("/")
//         return
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.error || errorData.message || `Failed to add funds. Status: ${response.status}`)
//       }

//       const data = await response.json()
//       setSuccessMessage(data.success)
//       setUserData((prev) => ({
//         ...prev,
//         balance: (Number.parseFloat(prev.balance) + Number.parseFloat(addFundsAmount)).toFixed(2),
//       }))
//       setAddFundsAmount("")
//       setShowAddFundsModal(false)
//     } catch (error) {
//       console.error("Add funds error:", error)
//       setError(error.message || "Failed to add funds")
//     } finally {
//       setIsAddingFunds(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//             <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
   
//       <div className="flex-1 p-8">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
//             <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
//           </div>

//           {/* Messages */}
//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center"
//               >
//                 <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
//                 <span className="text-red-700 dark:text-red-400">{error}</span>
//               </motion.div>
//             )}
//             {successMessage && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
//               >
//                 <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
//                 <span className="text-green-700 dark:text-green-400">{successMessage}</span>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Profile Card */}
//             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <span className="text-2xl font-bold text-white">
//                       {userData.username ? userData.username.charAt(0).toUpperCase() : "U"}
//                     </span>
//                   </div>
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{userData.username}</h2>
//                   <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
//                     {userData.account_type === "DEMO" ? "Demo Account" : "Live Account"}
//                   </div>
//                 </div>

//                 {/* Balance Card */}
//                 <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Balance</span>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setShowAddFundsModal(true)}
//                       className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
//                     >
//                       <Plus className="h-4 w-4 mr-1" />
//                       Add Funds
//                     </motion.button>
//                   </div>
//                   <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                     ₹{Number.parseFloat(userData.balance).toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Form */}
//             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
//                 <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         <User className="h-4 w-4 inline mr-2" />
//                         Username
//                       </label>
//                       <input
//                         type="text"
//                         name="username"
//                         value={userData.username}
//                         onChange={handleChange}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                           formErrors.username
//                             ? "border-red-300 dark:border-red-600"
//                             : "border-gray-300 dark:border-gray-600"
//                         }`}
//                         required
//                       />
//                       {formErrors.username && (
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.username}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         <Mail className="h-4 w-4 inline mr-2" />
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={userData.email}
//                         onChange={handleChange}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                           formErrors.email
//                             ? "border-red-300 dark:border-red-600"
//                             : "border-gray-300 dark:border-gray-600"
//                         }`}
//                         required
//                       />
//                       {formErrors.email && (
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         <Phone className="h-4 w-4 inline mr-2" />
//                         Phone
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={userData.phone}
//                         onChange={handleChange}
//                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
//                           formErrors.phone
//                             ? "border-red-300 dark:border-red-600"
//                             : "border-gray-300 dark:border-gray-600"
//                         }`}
//                       />
//                       {formErrors.phone && (
//                         <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         Account Type
//                       </label>
//                       <select
//                         name="account_type"
//                         value={userData.account_type}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       >
//                         <option value="DEMO">Demo Account</option>
//                         <option value="LIVE">Live Account</option>
//                       </select>
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                         <Shield className="h-4 w-4 inline mr-2" />
//                         Risk Profile
//                       </label>
//                       <div className="flex items-center space-x-4 mb-3">
//                         <div
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${
//                             userData.risk_profile === "LOW"
//                               ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
//                               : userData.risk_profile === "MEDIUM"
//                                 ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
//                                 : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
//                           }`}
//                         >
//                           {userData.risk_profile.charAt(0) + userData.risk_profile.slice(1).toLowerCase()} Risk
//                         </div>
//                       </div>
//                       <select
//                         name="risk_profile"
//                         value={userData.risk_profile}
//                         onChange={handleChange}
//                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                       >
//                         <option value="LOW">Low Risk</option>
//                         <option value="MEDIUM">Medium Risk</option>
//                         <option value="HIGH">High Risk</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-end">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="submit"
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                     >
//                       Update Profile
//                     </motion.button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Add Funds Modal */}
//         <AnimatePresence>
//           {showAddFundsModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//               onClick={() => setShowAddFundsModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Funds</h3>
//                   <button
//                     onClick={() => setShowAddFundsModal(false)}
//                     className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
//                   >
//                     ×
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       <DollarSign className="h-4 w-4 inline mr-2" />
//                       Amount (₹)
//                     </label>
//                     <input
//                       type="number"
//                       value={addFundsAmount}
//                       onChange={(e) => setAddFundsAmount(e.target.value)}
//                       min="1"
//                       step="any"
//                       placeholder="Enter amount"
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => setShowAddFundsModal(false)}
//                       className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                     >
//                       Cancel
//                     </motion.button>
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleAddFunds}
//                       disabled={isAddingFunds}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
//                     >
//                       {isAddingFunds ? (
//                         <>
//                           <Loader className="h-4 w-4 animate-spin mr-2" />
//                           Processing...
//                         </>
//                       ) : (
//                         "Add Funds"
//                       )}
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Phone, Shield, DollarSign, Plus, AlertCircle, CheckCircle, Loader, CreditCard, Calendar, Lock } from "lucide-react"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user")
    return savedUser
      ? JSON.parse(savedUser)
      : {
          username: "",
          email: "",
          phone: "",
          account_type: "DEMO",
          risk_profile: "MEDIUM",
          balance: "0.00",
        }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [addFundsAmount, setAddFundsAmount] = useState("")
  const [isAddingFunds, setIsAddingFunds] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  })
  const [cardErrors, setCardErrors] = useState({})

  const updateLocalStorageUser = (userData) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        account_type: userData.account_type,
        risk_profile: userData.risk_profile,
        balance: userData.balance,
      }),
    )
  }

  const fetchProfile = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const response = await fetch("http://localhost:8000/api/account/profile/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      })

      if (response.status === 401) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        navigate("/")
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Server responded with status ${response.status}`)
      }

      const data = await response.json()
      const updatedUserData = {
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        account_type: data.account_type || "DEMO",
        risk_profile: data.risk_profile || "MEDIUM",
        balance: data.balance || "0.00",
      }

      setUserData(updatedUserData)
      updateLocalStorageUser(updatedUserData)
    } catch (error) {
      console.error("Fetch profile error:", error)
      setError(error.message || "Failed to fetch profile data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const validateProfile = () => {
    const errors = {}

    if (!userData.username || userData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    } else if (userData.username.length > 20) {
      errors.username = "Username must be less than 20 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (userData.phone && !/^[0-9]{10,15}$/.test(userData.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid phone number (10-15 digits)"
    }

    return errors
  }

  const validateCardDetails = () => {
    const errors = {}
    
    // Validate card number (basic Luhn algorithm check)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '')
    if (!cardNumber || cardNumber.length < 16 || !/^[0-9]{16,19}$/.test(cardNumber)) {
      errors.cardNumber = "Please enter a valid card number"
    }
    
    // Validate expiry date (MM/YY format)
    if (!cardDetails.expiryDate || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiryDate)) {
      errors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    } else {
      const [month, year] = cardDetails.expiryDate.split('/')
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      const today = new Date()
      if (expiry < today) {
        errors.expiryDate = "Card has expired"
      }
    }
    
    // Validate CVV
    if (!cardDetails.cvv || !/^[0-9]{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = "Please enter a valid CVV"
    }
    
    // Validate cardholder name
    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 2) {
      errors.cardholderName = "Please enter cardholder name"
    }
    
    // Validate amount
    if (!addFundsAmount || Number.parseFloat(addFundsAmount) <= 0) {
      errors.amount = "Please enter a valid amount"
    } else if (Number.parseFloat(addFundsAmount) > 10000) {
      errors.amount = "Maximum amount per transaction is ₹10,000"
    }
    
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19)
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }))
    } 
    // Format expiry date
    else if (name === "expiryDate") {
      let formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4)
      }
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }))
    }
    // Format CVV (numbers only)
    else if (name === "cvv") {
      setCardDetails(prev => ({ ...prev, [name]: value.replace(/\D/g, '').slice(0, 4) }))
    }
    else {
      setCardDetails(prev => ({ ...prev, [name]: value }))
    }
    
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    const errors = validateProfile()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setError("Please fix the form errors")
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const response = await fetch("http://localhost:8000/api/account/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          account_type: userData.account_type,
          risk_profile: userData.risk_profile,
        }),
      })

      if (response.status === 401) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        navigate("/")
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (errorData.username) {
          throw new Error(`Username: ${errorData.username.join(" ")}`)
        } else if (errorData.email) {
          throw new Error(`Email: ${errorData.email.join(" ")}`)
        } else if (errorData.phone) {
          throw new Error(`Phone: ${errorData.phone.join(" ")}`)
        } else {
          throw new Error(errorData.detail || errorData.message || `Server responded with status ${response.status}`)
        }
      }

      const data = await response.json()
      const updatedUserData = {
        username: data.username || userData.username,
        email: data.email || userData.email,
        phone: data.phone || userData.phone,
        account_type: data.account_type || userData.account_type,
        risk_profile: data.risk_profile || userData.risk_profile,
        balance: data.balance || userData.balance,
      }

      setUserData(updatedUserData)
      updateLocalStorageUser(updatedUserData)
      setSuccessMessage("Profile updated successfully!")
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Update profile error:", error)
      setError(error.message || "Failed to update profile")
    }
  }

  const handleAddFunds = async () => {
    const errors = validateCardDetails()
    if (Object.keys(errors).length > 0) {
      setCardErrors(errors)
      setError("Please fix the form errors")
      return
    }

    setIsAddingFunds(true)
    setError("")
    setSuccessMessage("")

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      // Simulate API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Payment processing failed. Please try again or use a different card.")
      }

      const response = await fetch("http://localhost:8000/api/account/add_funds/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ amount: addFundsAmount }),
      })

      if (response.status === 401) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        navigate("/")
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `Failed to add funds. Status: ${response.status}`)
      }

      const data = await response.json()
      setSuccessMessage(`Successfully added ₹${addFundsAmount} to your account!`)
      setUserData((prev) => ({
        ...prev,
        balance: (Number.parseFloat(prev.balance) + Number.parseFloat(addFundsAmount)).toFixed(2),
      }))
      setAddFundsAmount("")
      setCardDetails({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: ""
      })
      setShowAddFundsModal(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      console.error("Add funds error:", error)
      setError(error.message || "Failed to add funds")
    } finally {
      setIsAddingFunds(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center"
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center"
              >
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-700 dark:text-green-400">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {userData.username ? userData.username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{userData.username}</h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                    {userData.account_type === "DEMO" ? "Demo Account" : "Live Account"}
                  </div>
                </div>

                {/* Balance Card */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Balance</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddFundsModal(true)}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Funds
                    </motion.button>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{Number.parseFloat(userData.balance).toFixed(2)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          formErrors.username
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        required
                      />
                      {formErrors.username && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          formErrors.email
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          formErrors.phone
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Optional"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account Type
                      </label>
                      <select
                        name="account_type"
                        value={userData.account_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="DEMO">Demo Account</option>
                        <option value="LIVE">Live Account</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Shield className="h-4 w-4 inline mr-2" />
                        Risk Profile
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userData.risk_profile === "LOW"
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                              : userData.risk_profile === "MEDIUM"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                          }`}
                        >
                          {userData.risk_profile.charAt(0) + userData.risk_profile.slice(1).toLowerCase()} Risk
                        </div>
                      </div>
                      <select
                        name="risk_profile"
                        value={userData.risk_profile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="LOW">Low Risk</option>
                        <option value="MEDIUM">Medium Risk</option>
                        <option value="HIGH">High Risk</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Update Profile
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Add Funds Modal */}
        <AnimatePresence>
          {showAddFundsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddFundsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Funds</h3>
                  <button
                    onClick={() => setShowAddFundsModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-2" />
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                      min="1"
                      max="10000"
                      step="any"
                      placeholder="Enter amount"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        cardErrors.amount ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {cardErrors.amount && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cardErrors.amount}</p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Card Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              cardErrors.cardNumber ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                        </div>
                        {cardErrors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cardErrors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              cardErrors.expiryDate ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {cardErrors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cardErrors.expiryDate}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock className="h-4 w-4 inline mr-2" />
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              cardErrors.cvv ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {cardErrors.cvv && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cardErrors.cvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardDetails.cardholderName}
                          onChange={handleCardChange}
                          placeholder="John Doe"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            cardErrors.cardholderName ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                        {cardErrors.cardholderName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{cardErrors.cardholderName}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowAddFundsModal(false)
                        setCardErrors({})
                      }}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddFunds}
                      disabled={isAddingFunds}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {isAddingFunds ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Add Funds"
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Your card details are not stored. This is a simulation for demonstration purposes.
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProfilePage