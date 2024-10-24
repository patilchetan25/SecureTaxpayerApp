import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Import useAuth
import toast from 'react-hot-toast';


export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')) : null;
  console.log(user)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    toast.success('Logout Successfull');
    navigate('/login');
    // try {
    //   const { data } = await axios.post('/logoutUser');
    //   if (data.error) {
    //     toast.error(data.error);
    //   } else {
    //     localStorage.removeItem('user');
    //     toast.success('Logout Successfull');
    //     navigate('/login');
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // localStorage.removeItem('user');
    // navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && (<p>Welcome, {user.name}</p>)}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
