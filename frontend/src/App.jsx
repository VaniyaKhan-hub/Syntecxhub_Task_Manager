import React, { useEffect, useState } from 'react'
import Login from './components/Login';
import { Outlet, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Layout from './components/Layout';
import SignUp from './components/SignUp';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import CompletedPage from './pages/CompletedPage';
import Profile from './components/Profile';

const App = () => {
  const navigate = useNavigate();
  const [currentuser, setCurrentUser] = useState(() => {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    if (currentuser) {
      localStorage.setItem('currentUser', JSON.stringify(currentuser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentuser])

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }
    setCurrentUser(user);
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true })
  }

  const ProtectedLayout = () => <Layout user={currentuser} onLogout={handleLogout}/>

  return (
    <Routes>

      {/* LOGIN / SIGNUP */}
      <Route path='/login' element={
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
        </div>
      } />
      <Route path='/signup' element={
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
        </div>
      } />

      {/* PROTECTED ROUTES */}
      <Route path='/' element={currentuser ? <ProtectedLayout /> : <Navigate to='/login' replace />}>

        {/* Default route for "/" */}
        <Route index element={<Dashboard />} />

        {/* Nested pages */}
        <Route path='pending' element={<PendingPage />} />
        <Route path='complete' element={<CompletedPage />} />
        <Route path='profile' element={<Profile user={currentuser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>

      {/* CATCH ALL */}
      <Route path='*' element={<Navigate to={currentuser ? '/' : '/login'} replace />} />

    </Routes>
  )
}

export default App
