import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

const register = (username, email, password, userType, firstName, lastName) => {
  return axios.post(API_URL + 'register/', {
    username,
    email,
    password,
    user_type: userType,
    first_name: firstName,
    last_name: lastName
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + 'token/', {
      username,
      password
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.access) {
    return { Authorization: 'Bearer ' + user.access };
  } else {
    return {};
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  authHeader
};