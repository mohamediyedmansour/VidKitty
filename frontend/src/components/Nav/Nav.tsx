import React from 'react';
import './Nav.css';

const Nav: React.FC = () => {
  return (
    <nav className="vk-nav">
      <div className="vk-nav-inner">
        <img src="/logo.svg" alt="VidKitty logo" className="vk-logo" />
        <div className="vk-spacer" />
        <button className="vk-login" aria-label="Login">
          <span className="vk-login-text">Login</span>
        </button>
      </div>
    </nav>
  );
};

export default Nav;
