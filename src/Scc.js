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
  const [isLoggedIn, setIsLoggedIn] = useState(null); // 초기값 null

  useEffect(() => {
    const storedStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedStatus === "true");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  // 로딩 상태 처리
  if (isLoggedIn === null) {
    return <div>Loading...</div>; // 로딩 중일 때 빈 화면 또는 로딩 스피너
  }

  return (
    <Router>
      <Layout setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
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