import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Welcome.css'; 
import Footer from './Footer';
import Round from './Round';
import Scroll from './Scroll';
import Centercards from './Centercards';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaBell } from 'react-icons/fa';
import WorkSection from './WorkSection';
import HomePageBannerSection from './HomePageBannerSection';
import QSNPattern from './QSNPattern';

function Welcome() {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('api/users/get-notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchData();
  }, []);

  const notificationLinks = notifications.map((notification, index) => ({
    notification_text: notification.notification_text,
    id: notification.id, 
    time: formatDate(notification.created_at) 
  }));
  
  function getMonthAbbreviation(month) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month - 1];
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthAbbreviation(date.getMonth() + 1); 
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`; 
  }

  return (
    <>
      <div className="welcome-cont">
        <div className="image-carousel">
          <div>
            <div className='welcome'></div>
            <div className='image'></div>
          </div>
        </div>
        <HomePageBannerSection/>
        <div className='bar'>
          <nav className='NavbarItems'>
            <span className="logo-text">
              <span className="tour">BCG </span>
              <span className="buddy">DIGITAL</span>
            </span>
            <ul className='nav-menu' style={{ justifyContent: 'flex-end' }}>
              <li className='nav-links'>
                <i className="fa-solid fa-house-user"></i>
                Home
              </li>
              <li className='nav-links'>
                <i className="fa-solid fa-circle-info"></i>
                About
              </li>
              <li className='nav-links'>
                <i className="fa-solid fa-address-book"></i>
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="welcome-container">
        <div className="welcome-content">
          {notificationLinks.length > 0 && (
            <div className="notifications-container">
              <p className="notification-head" style={{fontSize:"20px"}}>
                <FaBell className="notification-icon" />
                Latest Notifications:
              </p>
              <div className="notifications">
                <ul>
                  {notificationLinks.map((link) => (
                    <li key={link.id}>
                      {link.notification_text && (
                        <div className="notification-item">
                          <span className="notification-text">
                            <a href={`/registration/${link.id}/${encodeURIComponent(link.notification_text)}`} target="_blank" rel="noopener noreferrer">
                              <span className="new-notification-icon"></span>
                              <span className="time">{link.time}</span>
                              <span className="gif-image">
                                <img src="https://ssc.nic.in/Content/library/assets/images/new.gif" alt="New GIF" />
                              </span>
                              <span className="notification-content">{link.notification_text}</span>
                            </a>
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Include the rest of your JSX components */}
      <div className="features-heading">
        <div >
          <h1>Features Of Digital Examination</h1>
        </div>
      </div>
      <Centercards />
      <div className='helps'>
        <div>
          <h2>How This Platform Helps You</h2>
        </div>
        <div className="columns">
          <div>
            <h1><img src='safeexambrowser.png' alt=''/></h1>
            <h1>safe exam browser</h1>
            <p>prevents candidates from accessing the internet. Once enabled, this feature detects and ends the test for the examinees who browse away from the test window and open multiple tabs on the browser.</p>
          </div>
          <div>
            <h1><img src='candidateauthentication.png' alt=''/></h1>
            <h1>Candidate Authentication</h1>
            <p>The platform eliminates any impersonation risk using multi-factor authentication using OTP, Aadhar/biometric or IP, followed by ID authentication. It also involves facial recognition by taking the candidates’ pictures and ID proof to avoid impersonation.</p>
          </div>
          <div>
            <h1><img src='humanproctoring.png' alt=''/></h1>
            <h1>Human proctoring</h1>
            <p>It enables monitoring of candidates’ behavior and actions for suspicious activities. With cheating prediction abilities as high as 95%,  proctoring technologies combine the latest advances in AI-based and remote live proctoring to eliminate the risk of cheating.</p>
          </div>
        </div>
      </div>
      {/* Include the rest of your JSX components */}
      <WorkSection />
      <div className='multi-container'>
        <h2>We Support the Following Question Types and Many More</h2>
      </div>
      <QSNPattern/>
      <Round/>
      <Footer/>
      <Scroll/>
    </>
  );
}

export default Welcome;
