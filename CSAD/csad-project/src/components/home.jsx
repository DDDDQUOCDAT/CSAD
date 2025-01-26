import { auth } from "../firebase/firebase";
function Home() {
    async function handleLogout() {
        try {
          await auth.signOut();
          window.location.href = "/login";
          console.log("User logged out successfully!");
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
      }
    return (
        <div className="App">
            <h1>Home</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
    }

export default Home