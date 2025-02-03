import { useState } from "react";
import { auth } from "../firebase/firebase";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";

function Account() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "User");
  const [photoURL] = useState(user?.photoURL || null);
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified);

  // ✅ Re-authenticate before updating email or password
  async function reauthenticateUser() {
    if (!currentPassword) {
      toast.error("Enter your current password to update email or password.");
      return false;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      toast.success("Re-authentication successful!");
      return true;
    } catch (error) {
      toast.error("Re-authentication failed! Incorrect password.");
      return false;
    }
  }

  // ✅ Handle Email Update with Verification
  async function handleEmailVerification() {
    if (!email || email === user.email) {
      toast.error("Enter a different email to update.");
      return;
    }

    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Please check your new email.");
      setEmailVerified(false);
    } catch (error) {
      toast.error("Error sending verification email.");
    }
  }

  async function handleUpdateEmail() {
    let isReauthenticated = await reauthenticateUser();
    if (!isReauthenticated) return;

    if (!emailVerified) {
      toast.error("Please verify your new email before updating.");
      return;
    }

    try {
      await updateEmail(user, email);
      toast.success("Email updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ✅ Handle Profile Update (Name & Password)
  async function handleUpdateProfile() {
    let requiresReauth = email !== user.email || newPassword;
    if (requiresReauth) {
      const isReauthenticated = await reauthenticateUser();
      if (!isReauthenticated) return;
    }

    try {
      if (user.displayName !== displayName) {
        await updateProfile(user, { displayName });
      }
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // ✅ Clear password fields after updating
      setNewPassword("");
      setCurrentPassword("");

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  // ✅ Handle Logout
  async function handleLogout() {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Error logging out!");
    }
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#121212] min-h-screen text-white">
      {/* Profile Card */}
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center">
          {photoURL ? (
            <img src={photoURL} alt="Profile" className="w-20 h-20 rounded-full border-2 border-gray-500" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold mt-4">{displayName}</h2>
        <p className="text-gray-400">{email}</p>
      </div>

      {/* Update Profile Form */}
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
        <label className="text-gray-400 text-sm font-semibold">Display Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <label className="text-gray-400 text-sm font-semibold mt-3">New Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ Send Verification Email Button */}
        <button
          onClick={handleEmailVerification}
          className="w-full mt-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
        >
          Send Verification Email
        </button>

        <button
          onClick={handleUpdateEmail}
          className="w-full mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Update Email (After Verification)
        </button>

        <label className="text-gray-400 text-sm font-semibold mt-3">New Password</label>
        <input
          type="password"
          placeholder="Enter new password (optional)"
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="text-gray-400 text-sm font-semibold mt-3">Current Password</label>
        <input
          type="password"
          placeholder="Required for email/password change"
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* ✅ Update Profile & Logout Buttons Side by Side */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpdateProfile}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Update Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
