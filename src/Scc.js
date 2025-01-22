import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    if (storedStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
    <Router>
      <Layout>
        {/* <MusicProvider> */}
          <Routes>
          {/* <Route
            path="/login"
            element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}/> */}
            <Route
              path="/login"
              element={!isLoggedIn || window.location.search.includes('forceLogin=true') ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}/>
              {/* 디렉토링 시, 경로에 /login?forceLogin=true 추가해서 확인하기. */}
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}/>
          <Route path='/join-us' element={<Join />}></Route>
          <Route path='/explore' element={<Explore />}></Route>
          <Route path='/shop' element={<Shop />}></Route>
          <Route path='/bag' element={<Bag />}></Route>
          <Route path='/record' element={<Record />}></Route>
          </Routes>
        {/* </MusicProvider> */}
      </Layout>
    </Router>
    </div>
  );
}

export default App;
