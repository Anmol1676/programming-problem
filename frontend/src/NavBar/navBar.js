import React from "react";
import './nav.css';
import { Link, useNavigate } from 'react-router-dom';

function NavBar({ onLogout }) {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            {/* Top row for brand and auth links */}
            <div className="top-row">
                <div className="auth-links">
                    <button className="navigation-item navigation-link auth special" onClick={(e) => {
                        e.preventDefault(); 
                        onLogout();
                        navigate('/');
                    }}>Logout</button>
                </div>
            </div>

            {/* Bottom row for navigation buttons */}
            <div className="navbar-nav">
                <Link to='/Channel' className="Channel">Channel</Link>
                <Link to='/Search' className="home">Search</Link>
            </div>
        </nav>
    );
}

export default NavBar;
