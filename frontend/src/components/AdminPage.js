import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminpage.css';
// import ViewQuestionsComponent from './ViewQuestionsComponent';
import axios from 'axios';

const AdminComponent = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState(null); // State to manage which section to display
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [questionPaper, setQuestionPaper] = useState([]);
  const [uploadLogo, setUploadLogo] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


  const userid = localStorage.getItem('userid');
  const username = localStorage.getItem('username');
  

  const handleViewSection = (sectionName) => {
    setSection(sectionName);
    if (sectionName === 'notifications') {
      axios
        .get('api/users/get-notifications-admin')
        .then((response) => {
          const userNotifications = response.data.filter(notification => notification.user_id == userid);
          setNotifications(userNotifications);
          // setNotifications(response.data);
          setResults([]);
          setUsers([]);
        })
        .catch((error) => console.error('Error fetching notifications:', error));
    } // Assuming you're using Axios for HTTP requests
    else if (sectionName === 'results') {
      axios
        .get('api/users/getresults')
        .then((response) => {
          // Assuming date_and_time is in format 'YYYY-MM-DD HH:mm:ss'
          const formattedResults = response.data.map(result => ({
            ...result,
            date_and_time: new Date(result.date_and_time).toLocaleString()
          }));
          setResults(formattedResults);
          setNotifications([]);
          setUsers([]);
          
        })
        .catch((error) => console.error('Error fetching results:', error));
       
    } else if (sectionName === 'users') {
      axios
        .get('api/users/getusers')
        .then((response) => {
          setUsers(response.data);
          setNotifications([]);
          setResults([]);
        })
        .catch((error) => console.error('Error fetching users:', error));
    }
  };


  const handleAddNotification = async () => {
    const notificationText = prompt('Enter the text for the notification:');
    const userId = userid;
    if (notificationText) {
      try {
        await axios.post(`api/users/add-notification`, {
          userId, notificationText,
          examDate,
           startTime,
           endTime,
        });
        const response = await axios.get('api/users/get-notifications');
        setNotifications(response.data);
        alert(`Notification added successfully: ${notificationText}`);

        handleViewSection('notifications');
      } catch (error) {
        console.error('Error adding notification:', error);
        alert('Error adding notification. Please try again.');
      }
    }
};

  
  

  const handleDeleteNotification = (index, notificationId) => {
    axios
      .delete(`api/users/delete-notification/${notificationId}`)
      .then((response) => {
        console.log('Response:', response);
        if (response.data.success) {
          const updatedNotifications = [...notifications];
          updatedNotifications.splice(index, 1);
          setNotifications(updatedNotifications);
          alert('Notification deleted successfully');
        } else {
          alert('Failed to delete notification. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error deleting notification:', error);
        alert('Error deleting notification. Please try again.');
      });
  };

  const handleChangePassword = () => {
    navigate('/changeadminpassword'); // Navigate to the changeadminpassword route
  };
  const questionPaperChange = (e) => {    
    setQuestionPaper(e.target.files[0])
  };
  
  const handleQuestionPaperUpload = async (event, notificationId) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('file', questionPaper);
    formData.append('notificationId', notificationId);
  
    try {
      const response = await axios.post('api/users/upload-questionpaper/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        alert('File uploaded successfully!');
      } else {
        alert('Failed to upload file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };
  
  
const uploadLogoChange = (e) => {
    setUploadLogo(e.target.files[0]);
  };
  
  const handleLogoUpload = async (event, notificationId) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('file', uploadLogo); // Use uploadLogo instead of questionPaper
    formData.append('notificationId', notificationId);
  
    try {
      await axios.post(`api/users/upload-logo/${notificationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const handleExamDateChange = (e) => {
    setExamDate(e.target.value);
  };
 
  
  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };
  
  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };
  


  const handleExamDateSubmit = async (notificationId) => {

    try {
      const response = await axios.post(`/api/users/update-exam-date/${notificationId}`, {
        examDate: examDate, // Use the examDate state
      });
      if (response.data.success) {
        alert('Exam date updated successfully!');
      } else {
        alert('Failed to update exam date. Please try again.');
      }
    } catch (error) {
      console.error('Error updating exam date:', error);
      alert('Error updating exam date. Please try again.');
    }
  };
  
  const handleStartTimeSubmit = async (notificationId) => {
    try {
      const response = await axios.post(`/api/users/update-start-time/${notificationId}`, {
        startTime: startTime,
      });
      if (response.data.success) {
        alert('Start time updated successfully!');
      } else {
        alert('Failed to update start time. Please try again.');
      }
    } catch (error) {
      console.error('Error updating start time:', error);
      alert('Error updating start time. Please try again.');
    }
  };
  
  const handleEndTimeSubmit = async (notificationId) => {
    try {
      const response = await axios.post(`/api/users/update-end-time/${notificationId}`, {
        endTime: endTime,
      });
      if (response.data.success) {
        alert('End time updated successfully!');
      } else {
        alert('Failed to update end time. Please try again.');
      }
    } catch (error) {
      console.error('Error updating end time:', error);
      alert('Error updating end time. Please try again.');
    }
  };



  // const logout = () => {
  //   localStorage.removeItem('username');
  //   localStorage.removeItem('userid');
  //   navigate('/');
  //   window.history.replaceState(null, '', '/');
  // };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    navigate('/');
  };
  

  return (
    <div className="adminpage-container">
      <div className="asidebar">
        <img src="user.png" alt="Avatar" className="avatar" />
        <h3 className="username">{username}</h3>
        <button className="sidebar-button" onClick={() => handleViewSection('notifications')}>
          Notifications
        </button>
        <button className="sidebar-button" onClick={() => handleViewSection('results')}>
          View Results
        </button>
        <button className="sidebar-button" onClick={() => handleViewSection('users')}>
          View Users
        </button>
        <button className="sidebar-button" onClick={() => handleChangePassword()}>
          Change Password
        </button>
        <button className="sidebar-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="content">
        <h2>Admin Dashboard</h2>

        {section === 'notifications' && (
          <div className="notifications-list">
      <button className="sidebar-button" onClick={handleAddNotification}>
        Add Notifications
      </button>
      {notifications.length === 0 ? (
      <p>No notifications found.</p>
         ) : (
          <table>
            <thead>
              <tr>
                <th>Notification</th>
                <th>Created At</th>
                <th>Question Paper</th>
               <th>Upload Logo</th>
                <th>Exam Date</th>
                <th>startTime</th>
                <th>endTime</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={index}>
                  <td>{notification.notification_text}</td>
                  {/* <td>{notification.created_at}</td> */}
                  <td>{new Date(notification.created_at).toLocaleString()}</td>
                  <td>
                    {notification.qpaperpath ? (
                      <a href={notification.qpaperpath} rel="noopener noreferrer">
                        View Question Paper
                      </a>
                    ) : (
                      <form onSubmit={(event) => handleQuestionPaperUpload(event, notification.id)}>
                      <input type="file" onChange={questionPaperChange} />
                     <button className='sidebar-button' type="submit">
                    Upload
                    </button>
                    </form>
                    )}
                  </td>
 <td>
  {notification.uploadlogo ? (
    <img src={notification.uploadlogo} alt="Logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
  ) : (
    <form onSubmit={(event) => handleLogoUpload(event, notification.id)}>
      <input type="file" onChange={uploadLogoChange} />
      <button style={{ backgroundColor: 'blue' }} type="submit">
        Upload Logo
      </button>
    </form>
  )}
</td>
<td>
  <input type="date" value={notification.examDate} onChange={(e) => handleExamDateChange(e)} />
  <form onSubmit={(event) => handleExamDateSubmit(notification.id, event)}>
    <button style={{ backgroundColor: 'blue' }} type="submit">
      Submit
    </button>
  </form>
</td>
<td>
  <input type="time" value={notification.StartTime} onChange={(e) => handleStartTimeChange(e)} />
  <form onSubmit={(event) => handleStartTimeSubmit(notification.id, event)}>
    <button style={{ backgroundColor: 'blue' }} type="submit">
      Submit
    </button>
  </form>
</td>
<td>
  <input type="time" value={notification.EndTime} onChange={(e) => handleEndTimeChange(e)} />
  <form onSubmit={(event) => handleEndTimeSubmit(notification.id, event)}>
    <button style={{ backgroundColor: 'blue' }} type="submit">
      Submit
    </button>
  </form>
</td>
                  <td>
                    <button style={{backgroundColor: "red", color:"white" }} onClick={() => handleDeleteNotification(index, notification.id)}>
                      Delete Notification
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         )}
        </div>
        )}

        {section === 'results' && (
         <div className="results-table">
          {results.length === 0 ? (
      <p>No results found.</p>
    ) : (
      <React.Fragment>
         <h3>Results:</h3>
         <table>
           <thead>
             <tr>
               <th>User ID</th>
               <th>Username</th>
               <th>Score</th>
               <th>Date and Time</th>
             </tr>
           </thead>
           <tbody>
             {results.map((result, index) => (
               <tr key={index}>
                 <td>{result.user_id}</td>
                 <td>{result.user_name}</td>
                 <td>{result.score}</td>
                 {/* <td>{new Date(result.date_and_time).toLocaleString()}</td> */}
                 <td>{new Date(result.date_and_time).toLocaleString()}</td>


               </tr>
             ))}
           </tbody>
         </table>
         </React.Fragment>
    )}
       </div>
        )}

{section === 'users' && (
  <div className="users-table">
     {users.length === 0 ? (
      <p>No users found.</p>
    ) : (
      <React.Fragment>
    <h3>Users:</h3>
    <table>
      <thead>
        <tr>
          <th>Register Number</th>
          <th>Applicant Name</th>
          <th>Email</th>
          <th>Mobile Number</th>
          <th>Resume File</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.registerNumber}>
            <td>{user.registerNumber}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phoneNumber}</td>
            <td>
              <a href={user.resumePath} rel="noopener noreferrer">
                View Resume
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </React.Fragment>
    )}
  </div>
)}

   {/* </div>
 </div>
        )} */}

        {/* {section === null && (
          // Default empty state
          <div className="empty-state">
            Please select a section to view.
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AdminComponent;
