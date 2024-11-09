import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const { userInfo } = useAuth();


  const toggleLogoutMenu = () => {
    setShowLogoutMenu((prev) => !prev);
  };


  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = (userInfo && userInfo.isAdmin == true) ? true : false // Check if the user is admin

  const handleLogout = async () => {
    setShowLogoutMenu(false); // Hide the menu after logging out
    await logout();
    toast.success('Logout Successful');
    navigate('/login');

  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoutMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuRef = useRef(null);

  return (
    <div className="navbar">
    <h1>Secure Taxpayer Application</h1>
    <div className="nav-links">
      {/* Render link only if user is admin */}
      {isAdmin && (
                <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                    Admin Dashboard
                </Link>
      )}
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
      <Link to="/questions" className={location.pathname === '/questions' ? 'active' : ''}>Questions</Link>
      <Link to="/documents" className={location.pathname === '/documents' ? 'active' : ''}>Documents</Link>
    </div>
    <div className="profile-dropdown" ref={menuRef}>
      <div className="avatar" onClick={toggleLogoutMenu}>
        {userInfo && userInfo.firstName[0] + userInfo.lastName[0]}
      </div>
      {showLogoutMenu && (
        <div className="logout-menu show">
          <div className="logout-menu-item" onClick={handleLogout}>
            Log out
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
