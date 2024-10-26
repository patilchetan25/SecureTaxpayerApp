import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth
import toast from 'react-hot-toast';


export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')) : null;
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    toast.success('Logout Successfull');
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && (<p>Welcome, {user.name}</p>)}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
