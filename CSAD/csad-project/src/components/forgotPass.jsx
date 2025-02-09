import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import "./login.css";

const ForgotPass = () => {
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        const email = e.target.email.value; 
        if (!email) {
            toast.error("Please enter a valid email", { position: "top-center" });
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Email sent successfully! Check your inbox.", { position: "top-center" });
            navigate("/login");
        } catch (error) {
            console.error(error.message);
            toast.error("Error: " + error.message, { position: "top-center" });
        }
    };

    return (
        <div id="body">
            <div className="form-container">
                <p className="title">Forgot Password</p>
                <form className="form" onSubmit={handleReset}> 
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" placeholder="" required />
                        <button style={{ marginTop: "10px" }} className="sign" type="submit">
                            Reset Password
                        </button>
                        <Link to="/login">
                            <button style={{ marginTop: "10px" }} className="sign">Back</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPass;
