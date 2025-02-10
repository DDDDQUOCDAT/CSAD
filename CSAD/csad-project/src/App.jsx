import Signup from './components/signup';
import Login from './components/login';
import ForgotPass from "./components/forgotPass";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Insights from "./components/insights";
import Events from "./components/events";
import Rewards from './components/rewards';
import Community from './components/community';
import Account from './components/account';
import './App.css';
import Cookies from 'js-cookie';
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

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if(Cookies.get('signup')==='false'){
        setUser(user);
      }
    });

    return () => unsubscribe(); 
  }, []);


  return (
    <Router>
      <div className="flex">
        {user && <Sidebar />}
        <div className="flex-1 h-[100vh]">
          <Routes>
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
            <Route path='/community' element={<ProtectedRoute user={user}><Community /></ProtectedRoute>} />
            <Route path='/account' element={<ProtectedRoute user={user}><Account /></ProtectedRoute>} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to={user? "/dashboard" : "/login"} />} />
          </Routes>
        </div>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
      </div>
    </Router>
  );
}

export default App;