import { useContext, useState, useEffect, useRef } from 'react';
import '../css/NavBar.css';
import mylogo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileAvatarOpen, setIsMobileAvatarOpen] = useState(false);
  const avatarRef = useRef(null);
  const mobileAvatarRef = useRef(null);
  const navigate = useNavigate();
  const { userData, backendurl, setUserData, setIsLoggedin, getPropertiesData } = useContext(AppContent);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const LogOut = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendurl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendurl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
      if (mobileAvatarRef.current && !mobileAvatarRef.current.contains(event.target)) {
        setIsMobileAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">
            <img src={mylogo} alt="logo-A7laStay" className="logo-img" onClick={getPropertiesData}/>
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="nav-links">
          {/* Show links based on user role */}
          {userData && userData.role === "admin" && (
            <>
              
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
              
            </>
          )}

          {userData && userData.role === "owner" && (
            <>
             
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
              <li><Link to="/MyProperties" className="nav-link">Properties</Link></li>
              <li><Link to="/MyBookers" className="nav-link">Bookers</Link></li>
            </>
          )}

          {userData && userData.role === "user" && (
            <>
             
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
              <li><Link to="/Favoris" className="nav-link">Favoris</Link></li>
              <li><Link to="/BookingUser" className="nav-link">Booking</Link></li>
            </>
          )}
        </ul>

        {/* Desktop Avatar / Login */}
        <div className="auth-buttons">
          {userData ? (
            <div ref={avatarRef} className="avatar-wrapper">
              <div
                className="avatar"
                onClick={() => setIsAvatarMenuOpen(prev => !prev)}
              >
                {userData.name[0].toUpperCase()}
              </div>

              <ul className={`avatar-menu ${isAvatarMenuOpen ? 'show' : ''}`}>
                {!userData.isAccountverified && (
                  <li onClick={sendVerificationOtp}>Verify Email</li>
                )}
                <li onClick={LogOut}>Log Out</li>
              </ul>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="login-btn">
              Login
            </button>
          )}
        </div>

        {/* ✅ Hamburger Menu Button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        
        <Link to="/About-Us" className="mobile-link" onClick={() => setIsMenuOpen(false)}>About Us</Link>
        <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>

        {/* ✅ Mobile Avatar or Login */}
        {userData ? (
          <div ref={mobileAvatarRef} className="mobile-avatar-wrapper">
            <div
              className="mobile-avatar"
              onClick={() => setIsMobileAvatarOpen(prev => !prev)}
            >
              {userData.name[0].toUpperCase()}
            </div>

            <ul className={`mobile-avatar-menu ${isMobileAvatarOpen ? 'show' : ''}`}>
              {!userData.isAccountverified && (
                <li onClick={() => { sendVerificationOtp(); setIsMenuOpen(false); }}>Verify Email</li>
              )}
              <li onClick={() => { LogOut(); setIsMenuOpen(false); }}>Log Out</li>
            </ul>
          </div>
        ) : (
          <div className="mobile-auth-buttons">
            <button
              className="mobile-login-btn"
              onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;