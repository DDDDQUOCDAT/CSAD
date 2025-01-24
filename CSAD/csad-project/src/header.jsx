import './App.css'
const Header = () => (
    <form className="form">
        <p className="heading">Login</p>
        <div className="form-control">
            <input type="value" required />
            <label>
                <span style={{ transitionDelay: '0ms' }}>Username</span>
            </label>
        </div>
        <div className="form-control">
            <input type="value" required />
            <label>
                <span style={{ transitionDelay: '0ms' }}>Password</span>
            </label>
        </div>
        <button className="btn">Log In</button>
    </form>
);
export default Header