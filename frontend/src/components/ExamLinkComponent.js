import React, { useState, useEffect } from 'react';

const ExamLinkComponent = () => {
  const [examLink, setExamLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the exam link when the component mounts
    fetchExamLink();
  }, []);

  const fetchExamLink = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/exam-link');
      if (response.ok) {
        const data = await response.json();
        if (data.link) {
          // Enable the exam link button or display the link
          setExamLink(data.link);
        } else {
          // Display a message based on data.message
          setErrorMessage(data.message);
        }
      } else {
        // Handle other HTTP errors
        setErrorMessage('Failed to fetch the exam link');
      }
    } catch (error) {
      // Handle fetch errors
      setErrorMessage('Error fetching the exam link');
    }
  };

  return (
    <div>
      {examLink ? (
        <div>
          <p>Exam Link: <a href={examLink} target="_blank" rel="noopener noreferrer">{examLink}</a></p>
          {/* Enable the exam link button or render the link */}
        </div>
      ) : (
        <p>{errorMessage || 'Fetching the exam link...'}</p>
      )}
    </div>
  );
};

export default ExamLinkComponent;
