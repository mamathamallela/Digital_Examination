import React from 'react';
import './WorkSection.css'; // Import CSS file for styling

const WorkSection = () => {
    return (
        <div className="work_section">
            <div className="container_row">
                <div className="work_title">
                    <h2>How It Works?</h2>
                </div>

                <div className="sec-process-step">
                    <div className="process_sec">

                        <ul>
                            <li>
                                <img src="https://nextbigtechnology.com/wp-content/uploads/2022/02/work-Discovery-new.jpg" alt="Discovery" />
                                <span>01</span>

                                <h6>Discovery</h6>
                            </li>
                            <li>
                                <img src="https://nextbigtechnology.com/wp-content/uploads/2022/02/work-design-2.jpg" alt="Design" />
                                <span>02</span>
                                <h6>Design</h6>
                            </li>
                            <li>
                                <img src="https://nextbigtechnology.com/wp-content/uploads/2022/02/work-development-3.jpg" alt="Development" />
                                <span>03</span>
                                <h6>Development</h6>
                            </li>
                            <li>
                                <img src="https://nextbigtechnology.com/wp-content/uploads/2022/02/work-testing-4.jpg" alt="Testing" />
                                <span>04</span>
                                <h6>Testing</h6>
                            </li>
                            <li>
                                <img src="https://nextbigtechnology.com/wp-content/uploads/2022/02/work-Delivery5.jpg" alt="Delivery" />
                                <span>05</span>
                                <h6>Delivery</h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkSection;
