import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
//     <header className="header">
//     <nav className="nav">
//         <ul>
//             <li><a href="#home">Home</a></li>
//             <li><a href="#about">Questions</a></li>
//             <li><a href="#services">Documents</a></li>
//             <li><a href="#contact">Contact</a></li>
//         </ul>
//     </nav>
// </header>
    <nav>
        <Link to='/'>Dashboard</Link>
        <Link to='login'>Login</Link>
        <Link to='registration'>Registration</Link>
    </nav>
  )
}
