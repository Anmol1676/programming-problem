
import React from "react";
import './nav.css';
import { Link } from 'react-router-dom';

function nav() {
    return (
        <nav className="navbar">
            {/* Top row for brand and auth links */}
            <div className="top-row">
                <div className="auth-links">
                    <Link to='/login' className="login">Login</Link>
                    <Link to='/registration' className="registration">Join us</Link>
                </div>
            </div>

            {/* Bottom row for navigation buttons */}
            <div className="navbar-nav">
                <Link to='/' className="home">Home</Link>
                <Link to='/post' className="Post">Post</Link>
                <Link to='/search' className="search">Search</Link>
            </div>
        </nav>
    );
}

export default nav;
