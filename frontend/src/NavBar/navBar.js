
import React from "react";
import './nav.css';
import { Link } from 'react-router-dom';

function navBar({onLogout}) {
    return (
        <nav className="navbar">
            {/* Top row for brand and auth links */}
            <div className="top-row">
                <div className="auth-links">

                    <Link to='/Profile' className="Profile">Profile</Link>
  
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

export default navBar;
