import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ currentPage, setCurrentPage, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [notifications]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo" onClick={() => handleNavClick('home')}>
          <div className="logo-icon">
            <div className="pulse-circle"></div>
            <span className="logo-cross">+</span>
          </div>
          <span className="logo-text">HealthPortal</span>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li>
              <button 
                className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${currentPage === 'book' ? 'active' : ''}`}
                onClick={() => handleNavClick('book')}
              >
                Book Appointment
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${currentPage === 'doctors' ? 'active' : ''}`}
                onClick={() => handleNavClick('doctors')}
              >
                Our Doctors
              </button>
            </li>
            <li>
              <button 
                className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                Dashboard
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="user-info">
            {user ? (
              <div className="user-profile">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User Avatar" 
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
              </div>
            ) : (
              <button className="login-button">Login</button>
            )}
          </div>
          
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {isMenuOpen && <div className="mobile-overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;