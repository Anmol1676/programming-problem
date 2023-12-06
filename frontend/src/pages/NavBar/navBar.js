import React from "react";
import './nav.css';
import { Link, useNavigate } from 'react-router-dom';

function NavBar({ onLogout, username }) {
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
                <Link to='/Channel' className="Channel"><button>Channel</button></Link>
                <Link to='/Search' className="home"><button>Search</button></Link>
                {username==="admin" && <Link to='/users' className="home"><button>Users</button></Link>}

               

            </div>
        </nav>
    );
}

export default NavBar;
