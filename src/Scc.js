import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/other/ProtectedRoute";

import './js/common.js'
import Layout from './components/layout/Layout.js';
import Home from './section/home/Home.js';
import Login from './section/login/Login.js';
import Join from './section/login/Join.js';
import Explore from './section/explore/Explore.js';
import Shop from './section/shop/Shop.js';
import Bag from './section/bag/Bag.js';
import Record from './section/record/Record.js';
import NotFound from './section/notFound.js';

import PreventRefresh from './section/explore/PreventRefresh';
import { MusicProvider } from "./js/MusicProvider";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    setIsLoggedIn(!!loggedInUser);
  }, []);

  const handleLogin = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setIsLoggedIn(true);
    }
  };

  function ProtectedExplore({ children }) {
    const allowed = sessionStorage.getItem("canEnterExplore") === "true";
    if (!allowed) {
      alert("우회 접근이 확인되었습니다. 『탐사하기』를 통해 진입해 주세요.");
      return <Navigate to="/" replace />;
    }
    return children;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return <p>로딩 중...</p>;
  }

  return (
    <Router>
      <MusicProvider>
        <Layout setIsLoggedIn={setIsLoggedIn}>
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/join-us" element={<Join />} />

            <Route path="/" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Home /></ProtectedRoute>} />
            <Route
              path="/explore"
              element={
                <ProtectedExplore>
                  <Explore />
                </ProtectedExplore>
              }/>
            <Route path="/shop" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Shop /></ProtectedRoute>} />
            <Route path="/bag" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Bag /></ProtectedRoute>} />
            <Route path="/record" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Record /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <PreventRefresh />
      </MusicProvider>
    </Router>
  );
}

export default App;
