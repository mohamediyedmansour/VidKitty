import React, { useState } from 'react';
import './Nav.css';
import { useAuth } from '../../state/AuthContext';
import AuthModal from '../AuthModal/AuthModal';

const Nav: React.FC = () => {
  const { isLoggedIn, login, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'logout'>('login');

  const handleClick = () => {
    if (isLoggedIn) setModalMode('logout');
    else setModalMode('login');
    setShowModal(true);
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
          onLogin={(email, _password) => {
            // For now AuthContext.login doesn't take credentials — call login()
            // Credentials can be used later when a real auth backend is wired.
            console.log('Login attempt', { email });
            login();
            setShowModal(false);
          }}
          onLogout={() => {
            logout();
            setShowModal(false);
          }}
        />
      </div>
    </nav>
  );
};

export default Nav;
