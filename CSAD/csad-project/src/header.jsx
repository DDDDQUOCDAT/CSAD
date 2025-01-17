import './App.css'
const Header = () => (
    <form className="form">
        <p className="heading">Login</p>
        <div className="form-control">
            <input type="value" required />
            <label>
                <span style={{ transitionDelay: '0ms' }}>U</span>
                <span style={{ transitionDelay: '50ms' }}>s</span>
                <span style={{ transitionDelay: '100ms' }}>e</span>
                <span style={{ transitionDelay: '150ms' }}>r</span>
                <span style={{ transitionDelay: '200ms' }}>n</span>
                <span style={{ transitionDelay: '250ms' }}>a</span>
                <span style={{ transitionDelay: '300ms' }}>m</span>
                <span style={{ transitionDelay: '350ms' }}>e</span>
            </label>
        </div>
        <div className="form-control">
            <input type="value" required />
            <label>
                <span style={{ transitionDelay: '0ms' }}>P</span>
                <span style={{ transitionDelay: '50ms' }}>a</span>
                <span style={{ transitionDelay: '100ms' }}>s</span>
                <span style={{ transitionDelay: '150ms' }}>s</span>
                <span style={{ transitionDelay: '200ms' }}>w</span>
                <span style={{ transitionDelay: '250ms' }}>o</span>
                <span style={{ transitionDelay: '300ms' }}>r</span>
                <span style={{ transitionDelay: '350ms' }}>d</span>
            </label>
        </div>
        <button className="btn">Submit</button>
    </form>
);
export default Header