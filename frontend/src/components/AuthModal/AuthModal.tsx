import React, { useState } from 'react';
import './AuthModal.css';

type Mode = 'login' | 'logout';

type Props = {
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
};

const AuthModal: React.FC<Props> = ({ isOpen, mode, onClose, onLogin, onLogout }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleLogoutConfirm = () => {
    onLogout();
  };

  return (
    <div className="vk-auth-backdrop" role="dialog" aria-modal="true">
      <div className="vk-auth-modal">
        {mode === 'login' ? (
          <form className="vk-auth-form" onSubmit={handleSubmit}>
            <h2 className="vk-auth-title">Login</h2>

            <label className="vk-auth-label">
              Email
              <input
                className="vk-auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label className="vk-auth-label">
              Password
              <input
                className="vk-auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            <div className="vk-auth-actions">
              <button type="submit" className="vk-auth-button vk-auth-primary">
                Sign In
              </button>
              <button type="button" className="vk-auth-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="vk-auth-logout">
            <h2 className="vk-auth-title">Confirm Logout</h2>
            <p className="vk-auth-msg">Are you sure you want to logout?</p>
            <div className="vk-auth-actions">
              <button className="vk-auth-button vk-auth-primary" onClick={handleLogoutConfirm}>
                Logout
              </button>
              <button className="vk-auth-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
