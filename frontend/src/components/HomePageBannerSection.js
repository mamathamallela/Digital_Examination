import React from 'react';
import './HomePageBannerSection.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';

const HomePageBannerSection = () => {
    return (
        <div className="home_page_banner_section" style={{ backgroundImage: 'url(https://nextbigtechnology.com/wp-content/uploads/2022/01/bannerback.png)' }}>
            <div className="container_row">
                <div className="home_page_banner">
                    <div className="home_page_banner_left">
                        <div className="home_page_banner_left_content">
                            <h1>BCG Digital Exam Services<samp></samp></h1>
                            <p>Smarter Way to Evaluate Your Knowledge</p>
                            <div className="banner_buttons">
    <Link to="/adminlogin" style={{textDecoration: 'none'}}>
        <button className='welcbtn'>Get Started</button>
    </Link>
</div>
                        </div>
                    </div>
                    <div className="home_page_banner_right">
                        <div className="home_page_banner_right_content">
                            <div className="imganimation">
                                <img fetchpriority="high" className="banner_img" width="681" height="570" src="https://nextbigtechnology.com/wp-content/uploads/2022/04/eLearning_portal_development_banner_img.png" alt="icon" /> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageBannerSection;

