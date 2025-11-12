


import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import CompanyInfo from './components/CompanyInfo/CompanyInfo';
import Profile from './components/Profile/Profile';
import Footer from './components/Footer/Footer';
import CompanyList from './components/CompanyList/CompanyList';
import PortfolioPage from './components/portfolio/portfolio';

import WatchlistPage from './components/Watchlist/Watchlist';

import About from './components/About/About';
import Contact from './components/Contact/Contact';
import './App.css';

// Pages where we want to hide the navbar and footer
const HIDE_LAYOUT_PATHS = ['/profile', '/login', '/signup'];

const AppLayout = () => {
  const location = useLocation();
  const shouldHideLayout = HIDE_LAYOUT_PATHS.includes();

  return (
    <div className="app">
      {!shouldHideLayout && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock/:symbol" element={<CompanyInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<PortfolioPage />} />

          <Route path="/watchlist" element={<WatchlistPage />} />

          <Route path="/companies" element={<CompanyList />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Home showLogin={true} />} />
          <Route path="/signup" element={<Home showSignup={true} />} />
        </Routes>
      </div>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
