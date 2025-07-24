import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './api/axiosConfig';

// src/App.js
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/:originId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;



