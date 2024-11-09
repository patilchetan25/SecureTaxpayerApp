import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [data, setData] =  useState({
    email:"",
    password:""
  })

const loginAdmin = async (e) =>{
    e.preventDefault();
    e.preventDefault();
    const {email,password} = data;
    try{
        const {data} = await axios.post('/Adminlogin',{
            name,email,password
        });
        if(data.error){
            toast.error(data.error);
        }else{
            setData({});
            toast.success('Admin Login Successful');
            navigate('/admin/dashboard');
        }
    }catch(error){
        console.log(error);
        toast.error('An error occurred during admin login.');
    }
};

const navigateToUserLogin = () => {
    navigate('/login');
};
return (
    <form  onSubmit={loginAdmin}>
    <label>Email</label>
    <input type="email" value={data.email} onChange={(e) => setData({...data, email:e.target.value})} />
    <label>Password</label>
    <input type="password" value={data.password} onChange={(e) => setData({...data, password:e.target.value})} required />
    <button type='submit'>Login as Admin</button>

    <button onClick={navigateToUserLogin}>
        User Login
    </button>
    </form>
  );
}
