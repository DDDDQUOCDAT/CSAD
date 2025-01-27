import Signup from './components/signup'
import Login from './components/login';
import Home from "./components/home";
import './App.css';

import React, { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useState } from "react";
import { auth } from "./firebase/firebase";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/home" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
            </Routes>
            <ToastContainer />
    </Router>
  );
}

export default App;
