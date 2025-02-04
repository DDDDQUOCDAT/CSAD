import './login.css';
import React, { useState } from 'react';
import { auth, db } from '../firebase/firebase';
import {set, ref} from 'firebase/database';
import { createUserWithEmailAndPassword, signOut, updateProfile,} from 'firebase/auth';
import { toast } from "react-toastify";
import { useNavigate,Link } from 'react-router-dom';
import Cookies from 'js-cookie';
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (password !== password2) {
            toast.error("Passwords do not match!", {
                position: "top-center",
            });
            return;
        }
        Cookies.set('signup', 'true');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });
            await signOut(auth);
            await set(ref(db, 'Users/' + user.uid), {
                username: user.displayName,
                email: email,
              });
            console.log('User signed up successfully:', user);
            toast.success("User Registered Successfully!", {
                position: "top-center",
            });
            
            navigate("/login");

        } catch (error) {
             Cookies.set('signup', 'false');

            console.error("Signup error:", error.message);
            toast.error(error.message, {
                position: "top-center",
            });
        }
    };

    return (
        <div id="body">
            <div className="form-container">
                <p className="title">Sign Up</p>
                <form className="form" onSubmit={handleSignup}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            placeholder="" 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder="" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: "15px" }}>
                        <label htmlFor="password2">Confirm Password</label>
                        <input 
                            type="password" 
                            name="password2" 
                            id="password2" 
                            placeholder="" 
                            onChange={(e) => setPassword2(e.target.value)} 
                            required 
                        />
                    </div>
                    <button className="sign" type='submit'>Sign Up</button>
                </form>
                <Link to="/login"><button style={{ marginTop: "10px" }} className="sign">Back</button></Link>
        </div>
    </div>
    );
};

export default Signup;