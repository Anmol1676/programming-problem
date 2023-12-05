import React from "react";
import './nav.css';
import { Link } from 'react-router-dom';

function nav() {
    return (
        <nav className="navbar">
            {/* Top row for brand and auth links */}
            <div className="top-row">
                <div className="auth-links">
                   <Link to='/login' className="login"> <button className="loginButton">Login</button></Link>
                    <Link to='/registration' className="registration"><button>Join us</button></Link>
                </div>
            </div>

            {/* Bottom row for navigation buttons */}
            <div className="navbar-nav">
                <Link to='/' className="home"> <button>Home</button></Link>
            </div>
        </nav>
    );
}

export default nav;
