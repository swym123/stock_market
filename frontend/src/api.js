import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/account/",
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Signup with phone
export const signup = async (username, email, password, phone) => {
  try {
    const res = await API.post("signup/", { username, email, password, phone });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || "Signup failed" };
  }
};

// Login
export const login = async (username, password) => {
  try {
    const res = await API.post("login/", { username, password });
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || "Login failed" };
  }
};

// Get profile
export const getProfile = async () => {
  try {
    const res = await API.get("profile/");
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || "Failed to fetch profile" };
  }
};

// Update profile
export const updateProfile = async (data) => {
  try {
    const res = await API.put("profile/", data);
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || "Failed to update profile" };
  }
};

// Create transaction (BUY/SELL)
export const createTransaction = async (symbol, quantity, price, type) => {
  try {
    const res = await API.post("transactions/", {
      symbol,
      quantity,
      price,
      transaction_type: type, // must be "BUY" or "SELL"
    });
    return res.data;
  } catch (err) {
    return { error: Error(err, "Transaction failed") };
  }
};

// Get all transactions (with pagination if needed)
export const getTransactions = async (page = 1) => {
  try {
    const res = await API.get(`transactions/?page=${page}`);
    return res.data;
  } catch (err) {
    return { error: Error(err, "Failed to fetch transactions") };
  }
};
