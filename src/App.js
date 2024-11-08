import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarcodeGenerator from './components/BarCodeGenerator';
import POS from './components/POS';
import Inventory from './components/Inventory';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<BarcodeGenerator />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;