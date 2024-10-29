// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import DailyLogForm from './components/DailyLogForm';
import DataVisualization from './components/DataVisualization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/daily-log" element={<DailyLogForm />} />
        <Route path="/data-visualization" element={<DataVisualization />} />
      </Routes>
    </Router>
  );
}

export default App;
