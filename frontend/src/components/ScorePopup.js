import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const ScorePopup = ({ username, userid, score, categoryScores, questionPaper, onClose }) => {
  const [previewVisible, setPreviewVisible] = useState(true);
  const [notificationText, setNotificationText] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [logo, setLogo] = useState('');

  useEffect(() => {
    fetchNotificationText(userid);
    fetchUserDetails(userid);
  }, [userid]);

  const fetchNotificationText = async (userId) => {
    try {
      const response = await fetch(`/api/users/notification/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notification text');
      }
      const data = await response.json();
      setNotificationText(data.notification_text);
      setLogo(data.uploadlogo);
    } catch (error) {
      console.error('Error fetching notification text:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/users/user-details/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const getFormattedDateTime = () => {
    const currentDate = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const getMessage = (score, username) => {
    if (score < 20) {
      return `${username}! Your score is below 20. You can improve!`;
    } else if (score >= 20 && score <= 35) {
      return `${username}! Your score is between 21 and 35. Good job!`;
    } else {
      return `Congratulations, ${username}! Your score is between 36 and 50. Excellent work!`;
    }
  };

  const totalMarks = questionPaper.reduce((total, category) => {
    const marksPerQuestion = 2; // Assuming each question carries 2 marks
    const categoryTotalMarks = category.questions.length * marksPerQuestion;
    return total + categoryTotalMarks;
  }, 0);

  const percentageScore = (score / totalMarks) * 100;

  
  const htmlcontent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BCG Entrance Exam Score</title>
  <style>
    /* Your CSS styles here */
    .notification {
      display: flex;
      align-items: center; /* Center items vertically */
      justify-content: center; /* Center items horizontally */
      margin-bottom: 10px;
    }
    
    
    .notification-logo {
      width: 120px; /* Decrease the width of the logo */
      height: 120px;
      margin-right: 40px;
      border-radius:10px;
    }
    
    .notification-text {
      font-size: 20px; /* Decrease the font size of the notification text */
      margin: 0; /* Remove any default margin */
     
    }
    .notification-text span {
      font-size: 18px; /* Adjust the font size as needed */
    }
    
    
    .user-info {
      display: flex;
      align-items: center; /* Align items vertically */
    }
    
    .user-details {
      margin-right: 90px; /* Add some space between user details and avatar */
      margin-bottom: 50px;
    }
    
    .user-details p {
      margin: 0; /* Remove default paragraph margin */
    }
    
    .user-details p span {
      display: inline-block; /* Display spans as blocks */
      margin-right: 10px; /* Add margin between span elements */
    }
    
    .avatar img {
      width: 120px; /* Adjust the width of the avatar image */
      height: 130px; /* Adjust the height of the avatar image */
      border-radius: 10%; /* Make it circular */
      margin-bottom: 100px; /* Add margin at the bottom of the avatar */
      margin-top:-20px;
      margin-left: 180px; /* Add margin to the left of the avatar */
    }
    
    
    .score-table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
    }
    .percentage {
      margin-top: 20px; /* Add margin at the top of the percentage score section */
  }
    
    .score-table th, .score-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    
    .score-table th {
      background-color: #f2f2f2;
    }
    
    .separator {
      margin-top: 20px;
    }
    
    .footer {
      margin-top: 20px;
    }
    hr {
      border: 0;
      height: 5px;
      background-color: #ccc; /* Adjust the color of the line */
      margin: 20px 0; /* Adjust the margin around the line */
      margin-bottom:20px;
    }
  
  </style>
</head>
<body>
  <div class="notification-container">
    <div class="notification">
      <img src="${logo}" alt="Notification Logo" class="notification-logo" />
      <h1 class="notification-text">
      ${notificationText}
      <br><br>
      <span>Memorandum Of Category wise Performance</span><br><br>
      <span>Conducted by brightcomgroup</span>
    </h1>
    </div><br>
    <hr> <!-- Line to separate sections -->
    <div class="user-info">
      <div class="user-details">
      <p><span class="register-number" style="font-size: 18px;">Register Number: ${userid}</span></p>
      <p><span style="font-size: 18px;">Username: ${username}</span></p>
      <p style="font-size: 18px;">Gender: ${userDetails.gender}</p>
      <p style="font-size: 18px;">Date of Birth: ${formatDate(userDetails.birthDate)}</p>
  </div>
      <div class="avatar">
        <img src="Images/${userid}.png" alt="User Avatar" class="avatar"/>
      </div>
    </div>
  </div>
  
  <div>
    <h2>Category-wise Scores:</h2>
    <table class="score-table">
      <tr>
        <th>Category</th>
        <th>Total Marks</th>
        <th>Score</th>
        <th>Grade</th>
       
      </tr>
      ${Object.entries(categoryScores).map(([category, score]) => {
        // Calculate total marks for the category
        const totalMarks = questionPaper.find(cat => cat.category === category).questions.length * 2;
        let grade;
        if (score < totalMarks * 0.4) {
          grade = 'D';
        } else if (score < totalMarks * 0.6) {
          grade = 'C';
        } else if (score < totalMarks * 0.8) {
          grade = 'B';
        } else {
          grade = 'A';
        }
        return `
          <tr>
            <td>${category}</td>
            <td>${totalMarks}</td>
            <td>${score}</td>
            <td>${grade}</td>
          </tr>
        `;
      }).join('')}
   
      <tr>
        <td><strong>Total Marks:</strong></td>
        <td>${totalMarks}</td>
        <td>${score}</td>
        <td>
          ${(() => {
            let grade;
            if (score < totalMarks * 0.4) {
              grade = 'D';
            } else if (score < totalMarks * 0.6) {
              grade = 'C';
            } else if (score < totalMarks * 0.8) {
              grade = 'B';
            } else {
              grade = 'A';
            }
            return grade;
          })()}
        </td>
      </tr>

    </table>
  </div>
  
  <div class="percentage" style="font-size: 18px;">
    <p>Percentage Score: ${percentageScore.toFixed(2)}%</p>
  </div>
  
  <div>
    <p>${getMessage(score, username)}</p>
    <p>Your dedication and performance in ${notificationText}.</p>
    <p>Thank you for being a part of this examination. Your results are now available for download.</p>
  </div>

  <hr class="separator" />

  <div class="footer">
    <p>Conducted by BCG Digital Examinations</p>
    <p class="info">Date and Time: ${getFormattedDateTime()}</p>
  </div>
</body>
</html>
`;



  const content = htmlcontent;

  const downloadScorePage = () => {
    html2pdf(content, {
      margin: 20,
      filename: 'score_details.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });

    onClose();
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', textAlign: "center" }}>
      {previewVisible && (
        <div>
          <iframe
            title="Score Page Preview"
            srcDoc={content}
            style={{ width: '400px', height: '500px', border: '1px solid #ccc', marginBottom: '10px' }}
          />
        </div>
      )}

      <button onClick={downloadScorePage} style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', cursor: 'pointer', margin: "auto" }}>
        Download Score Page
      </button>
    </div>
  );
};

export default ScorePopup;

