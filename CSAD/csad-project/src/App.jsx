import Signup from './components/signup';
import Login from './components/login';
import ForgotPass from "./components/forgotPass";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Insights from "./components/insights";
import Events from "./components/events";
import Rewards from './components/rewards';
import Messages from './components/messages';
import Account from './components/account';
import './App.css';

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { auth } from "./firebase/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Wrapper
const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Once checked, stop loading
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>; // Show loading while checking auth
  }

  return (
    <Router>
      <div className="flex">
        {/* Sidebar now handles its own visibility */}
        {user && <Sidebar />}

        <div className="flex-1 p-4">
          <Routes>
            {/* Redirect automatically if logged in */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

            {/* Public Routes */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/forgotpass" element={user ? <Navigate to="/dashboard" /> : <ForgotPass />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute user={user}><Insights /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute user={user}><Events /></ProtectedRoute>} />
            <Route path="/rewards" element={<ProtectedRoute user={user}><Rewards /></ProtectedRoute>} />
            <Route path='messages' element={<ProtectedRoute user={user}><Messages /></ProtectedRoute>} />
            <Route path='account' element={<ProtectedRoute user={user}><Account /></ProtectedRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;
