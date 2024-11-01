import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/authContext';
import './Login.css'


export default function Login() {
  const { isAuthenticated, login, error } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const loginUser = async (e) => {
    e.preventDefault();
    await login(data);
  }

  return (
    <div className="login-container">
       <div className="login-box">
      <form onSubmit={loginUser}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>

    /* // <form onSubmit={loginUser}>
    //   <h3>Login</h3>
    //   <label>Email</label>
    //   <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
    //   <label>Password</label>
    //   <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
    //   <button type='submit'>Submit</button>
    // </form> */
  )
}
