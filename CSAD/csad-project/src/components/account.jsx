import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { 
  updateProfile, 
  updatePassword, 
  signOut, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";
import { ref, update, get } from "firebase/database";
import { toast } from "react-toastify";

function Account() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "User");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch the latest username from Firebase Realtime Database
  useEffect(() => {
    if (user) {
      const userRef = ref(db, `Users/${user.uid}/username`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setDisplayName(snapshot.val());
          }
        })
        .catch(() => {
          toast.error("Error fetching username");
        });
    }
  }, [user]);

  // ✅ Re-authenticate the user before updating password
  async function reauthenticateUser() {
    if (!currentPassword) {
      toast.error("Please enter your current password before updating.");
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

  // ✅ Handle Updating Display Name in Firebase Auth & Realtime Database
  async function handleUpdateDisplayName() {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(user, { displayName });
      await update(ref(db, `Users/${user.uid}`), { username: displayName });

      toast.success("Display name updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Handle Updating Password (With Re-authentication)
  async function handleUpdatePassword() {
    if (!newPassword) {
      toast.error("Enter a new password.");
      return;
    }

    const isReauthenticated = await reauthenticateUser();
    if (!isReauthenticated) return;

    try {
      setLoading(true);
      await updatePassword(user, newPassword);
      setNewPassword("");
      setCurrentPassword(""); // ✅ Clear password fields after updating
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    <div className="flex flex-col items-center p-8 h-[100%] bg-[#1c2633] text-white w-[100%]">
      <div className="bg-[#1e2939] p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-4">{displayName}</h2>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {/* Update Display Name */}
      <div className="bg-[#1e2939] p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
        <label className="text-gray-400 text-sm font-semibold">Display Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button
          onClick={handleUpdateDisplayName}
          className="w-full mt-3 bg-[#1e2939] text-white p-2 rounded hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Display Name"}
        </button>
      </div>

      {/* Update Password (With Re-authentication) */}
      <div className="bg-[#1e2939] p-6 rounded-lg shadow-lg w-full max-w-md mt-6">
        <label className="text-gray-400 text-sm font-semibold">New Password</label>
        <input
          type="password"
          placeholder=""
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="text-gray-400 text-sm font-semibold mt-3">Current Password</label>
        <input
          type="password"
          placeholder=""
          className="w-full p-2 border rounded bg-gray-800 text-white mt-1"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <button
          onClick={handleUpdatePassword}
          className="w-full mt-3 bg-[#1e2939] text-white p-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Logout Button */}
      <div className="w-half max-w-md mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Account;
