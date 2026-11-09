
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navItems = [
        { name: "Dashboard", path: "/", icon: "⌂" },
        { name: "Website Audit", path: "/audit", icon: "⌕" },
        { name: "Results", path: "/results", icon: "▤" },
        { name: "AI Settings", path: "/settings/ai", icon: "⚙" },
    ];

    return (
        <nav className="navbar">

            <NavLink to="/" className="navbar-logo">
                <div className="logo-icon">S</div>
                <div className="logo-text">
                    <h2>Siteltyics<span>IQ</span></h2>
                    <small>WEBSITE INTELLIGENCE</small>
                </div>
            </NavLink>

            <div className="navbar-links">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </div>

            <div className="navbar-right">
                <div className="navbar-status">
                    <span className="status-dot"></span>
                    System Ready
                </div>
            </div>

        </nav>
    );
}

export default Navbar;
