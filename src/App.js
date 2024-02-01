import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import UserPage from './component/UserPage';
import AdminPage from './component/AdminPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
