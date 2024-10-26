import { useState } from 'react'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import Navbar from './components/NavBar'
import Dashboard from '../src/pages/Dashboard'
import Registration from './pages/Registration'
import Login from './pages/Login'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { AuthProvider } from './context/authContext'; // Import the AuthProvider
import ProtectedRoute from './context/ProtectedRoute'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
      <AuthProvider>
      <Navbar />
      <Toaster position='top-right' toastOptions={{duration:3000}} />
      <Routes>
         <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
        <Route path='registration' element={<Registration/>}></Route>
        <Route path='login' element={<Login />}></Route>
      </Routes>
      </AuthProvider>
  )
}

export default App
