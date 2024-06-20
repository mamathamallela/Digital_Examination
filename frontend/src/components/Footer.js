import React from 'react';
import { FaEnvelope, FaSkype, FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container" style={{ backgroundImage: 'url("footer_bg.jpg")' }}>
            <div className="quick-links">
                <h3><strong>Quick Links</strong></h3>
                <p><a href="/">Home</a></p>
                <p><a href="/about">About</a></p>
                <p><a href="/services">Services</a></p>
                <p><a href="/terms">Terms and Conditions</a></p>
            </div>

            <div className='fa-icon'>
                <h3><strong>Contact Us</strong></h3>
                <p><FaEnvelope /> Email: <a href="mailto:bcgdigital@gmail.com">Bcgdigital@gmail.com</a></p>
                <p><FaSkype /> Skype: <a href="skype:Bcgdigitalexamination">Bcgdigitalexamination</a></p>
                <p><FaWhatsapp /> WhatsApp: <a href="https://wa.me/13054826524">6744910</a></p>
            </div>

            <div className="follow-us">
                <h3><strong>Follow Us</strong></h3>
                <a href="https://www.facebook.com"> <FaFacebook />Facebook</a>
                <a href="https://www.linkedin.com"><FaLinkedin />LinkedIn</a>
                <a href="https://twitter.com"><FaTwitter />Twitter</a>
                <a href="https://www.instagram.com"><FaInstagram />Instagram</a>
                <a href="https://www.pinterest.com"><FaPinterest />Pinterest</a>
            </div>
        </footer>
    );
};

export default Footer;
