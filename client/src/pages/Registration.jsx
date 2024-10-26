import axios from 'axios';
import React, { useState } from 'react'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/authContext';

export default function Registration() {
const { register } = useAuth();
const navigate = useNavigate();
 const [data, setData] = useState({
    name:"",
    email:"",
    password:""
 });

 const registerUser = async (e) =>{
    e.preventDefault();
    await register(data);
 }

  return (
    <div>
        <form  onSubmit={registerUser}>
            <h3>Registration</h3>
            <label>Name</label>
            <input type="text" value={data.name} onChange={(e) => setData({...data, name:e.target.value})} />
            <label>Email</label>
            <input type="email" value={data.email} onChange={(e) => setData({...data, email:e.target.value})} />
            <label>Password</label>
            <input type="password" value={data.password} onChange={(e) => setData({...data, password:e.target.value})} />
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}
