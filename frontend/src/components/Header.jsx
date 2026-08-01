import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const Header = ({ isConnected }) => {
  return (
    <>
      <div className="top-accent-bar"></div>
      <header className="header-bar">
        <div className="header-content">
          <div className="brand-logo-container">
            <img src="/logo.webp" alt="CloudBlitz Logo" className="brand-logo-img" />
          </div>
          
          <div className="header-title-container">
            <h1 className="header-title">Student Management System</h1>
          </div>

          {isConnected ? (
            <div className="system-badge-online" title="Flask Backend REST API Connected">
              <span className="pulse-dot-online"></span>
              <Wifi size={14} />
              <span>Backend Connected</span>
            </div>
          ) : (
            <div className="system-badge-offline" title="Cannot connect to Flask API server">
              <span className="pulse-dot-offline"></span>
              <WifiOff size={14} />
              <span>Backend Disconnected</span>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
