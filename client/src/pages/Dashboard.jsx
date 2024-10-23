import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post('/logoutUser');
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        localStorage.removeItem('user');
        toast.success('Logout Successfull');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem('user');
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
