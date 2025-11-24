import React, { useState } from 'react';
import './Nav.css';
import { useAuth } from '../../state/AuthContext';
import AuthModal from '../AuthModal/AuthModal';
import axios from 'axios';

const Nav: React.FC = () => {
  const { isLoggedIn, login, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'logout'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (isLoggedIn) setModalMode('logout');
    else setModalMode('login');
    setShowModal(true);
    setError(null);
  };

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL as string;
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      login(access_token);
      setShowModal(false);
    } catch (err: any) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <nav className="vk-nav">
      <div className="vk-nav-inner">
        <img src="/logo.svg" alt="VidKitty logo" className="vk-logo" />
        <div className="vk-spacer" />
        <button
          className="vk-login"
          aria-label={isLoggedIn ? 'Logout' : 'Login'}
          onClick={handleClick}
        >
          <span className="vk-login-text">{isLoggedIn ? 'Logout' : 'Login'}</span>
        </button>
        <AuthModal
          isOpen={showModal}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onLogin={handleLogin}
          onLogout={() => {
            logout();
            setShowModal(false);
          }}
        />
        {error && <div className="vk-auth-error">{error}</div>}
      </div>
    </nav>
  );
};

export default Nav;
