import '../css/footer.css'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          <h2 className="footer-logo">A7la Stay</h2>
          <p className="footer-slogan">
            Your trusted partner for booking guesthouses, coucous beach, and private homes.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
            <a href="mailto:contact@a7lastay.com" className="social-icon" aria-label="Contact">
              <Mail size={24} />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">connexion</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <ul className="footer-contact">
            <li className="contact-item">
              <MapPin size={18} strokeWidth={2} />
              <span>40 Imem Chefie, Tunis, Tunisia</span>
            </li>
            <li className="contact-item">
              <Mail size={18} strokeWidth={2} />
              <span>contact@a7lastay.com</span>
            </li>
            <li className="contact-item">
              <Phone size={18} strokeWidth={2} />
              <span>+216 28 819 958</span>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <div className="footer-section">
          <h3 className="footer-title">About Us</h3>
          <p className="footer-about">
            A7la Stay is your trusted destination for finding and booking unique accommodations in Tunisia.
          </p>
          <Link to="/About-Us" className="footer-btn">Learn More</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} A7la Stay. All rights reserved.</p>
        <span className="separator">|</span>
        <p className="Maher">Made with ❤️ by Maher</p>
      </div>
    </footer>
  )
}

export default Footer