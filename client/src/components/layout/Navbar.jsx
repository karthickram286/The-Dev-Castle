import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-primary">
            <h2>
                <Link to="/" style={{ textDecoration: 'none' }}>The Dev Castle</Link>
            </h2>

            <ul>
                <li><Link to="profiles.html" style={{ textDecoration: 'none' }}>Developers</Link></li>
                <li><Link to="/register" style={{ textDecoration: 'none' }}>Register</Link></li>
                <li><Link to="/login" style={{ textDecoration: 'none' }}>Login</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar
