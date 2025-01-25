import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/other/ProtectedRoute";
// import { MusicProvider } from "./js/MusicProvider.js";

import './js/common.js'
import Layout from './components/layout/Layout.js';
import Home from './section/home/Home.js';
import Login from './section/login/Login.js';
import Join from './section/login/Join.js';
import Explore from './section/explore/Explore.js';
import Shop from './section/shop/Shop.js';
import Bag from './section/bag/Bag.js';
import Record from './section/record/Record.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // localStorage에서 로그인 상태 확인
    const loggedInUser = localStorage.getItem("loggedInUser");
    setIsLoggedIn(!!loggedInUser); // loggedInUser가 존재하면 true
  }, []);

  const handleLogin = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Layout setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route
              path="/login"
              element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
            />
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/join-us" element={<Join />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/record" element={<Record />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;