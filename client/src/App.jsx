import { useState, useEffect } from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; // Assuming Navbar is your header
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Login from './pages/Login';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext'; // Import the AuthProvider
import { ProtectedRoute, AdminProtectedRoute } from './context/ProtectedRoute';
import Documents from './pages/Documents';
import Questions from './pages/Questions';
import DashboardAdmin from './pages/Admin/DashboardAdmin';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  const location = useLocation(); // Get the current location
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    // Check if the current path is either /login or /registration
    const hideHeaderPaths = ['/login', '/registration'];
    setIsHeaderVisible(!hideHeaderPaths.includes(location.pathname));
  }, [location.pathname]); // Run the effect when the path changes

  return (
    <AuthProvider>
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
      <div className={`cp-main-wrapper ${isHeaderVisible ? '' : 'no-header'}`}>
        {isHeaderVisible && (
          <div className="cp-header-wrap">
            <Navbar />
          </div>
        )}
        <div className="cp-content-wrap">
          <div className="middle-content">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="documents" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="questions" element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <AdminProtectedRoute>
                  <DashboardAdmin />
                </AdminProtectedRoute>
              } />
              <Route path="registration" element={<Registration />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
