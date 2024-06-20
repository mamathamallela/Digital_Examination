
import React from 'react';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="bg logo.png" alt="Brightcom Logo" className="logo" />
        <span className="brand-title">
          <h1>Brightcom</h1></span>
      </div>
      <ul className="nav-list">
        {/* <li className="nav-item dropdown">
          <a href="#" className="nav-link">
            Home
            
          </a>
          <div className="dropdown-content">
            <a href="#">Learning</a>
            <a href="#">Exercise</a>
            <a href="#">Schedule</a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a href="#" className="nav-link">
            About
            
          </a>
          <div className="dropdown-content">
            <a href="#">Learning</a>
            <a href="#">Exercise</a>
            <a href="#">Schedule</a>
          </div>

        </li>
        <li className="nav-item dropdown">
          <a href="#" className="nav-link">
            Services
            
          </a>
          <div className="dropdown-content">
            <a href="#">Learning</a>
            <a href="#">Exercise</a>
            <a href="#">Schedule</a>
          </div>
        </li>
        <li className="nav-item dropdown">
          <a href="#" className="nav-link">
            Contact
            
          </a>
          <div className="dropdown-content">
            <a href="#">Learning</a>
            <a href="#">Exercise</a>
            <a href="#">Schedule</a>
          </div>

        </li> */}
        {/* <li className="nav-item dropdown">
        <a href='/signup'><button>Login Admin</button></a>
        <a href='/login'><button>Log In</button></a>
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
