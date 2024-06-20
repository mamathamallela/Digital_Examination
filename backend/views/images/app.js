const currentDate = new Date();

// Make a GET request to your backend endpoint to fetch the exam link status
fetch('api/users/exam-link')
  .then(response => response.json())
  .then(data => {
    const { link } = data;
    
    if (link) {
      const allowedDate = new Date('2023-12-04'); // Replace with your allowed date
      const endTime = new Date('2023-12-04T12:30:00'); // Replace with your allowed end time
      
      if (currentDate >= allowedDate && currentDate <= endTime) {
        // Redirect the user to the exam link
        document.getElementById('examLink').href = link;
      } else {
        console.log('Exam link access denied');
        // You can display a message to the user that the exam is not available
      }
    } else {
      console.log('Exam link not available');
      // You can display a message to the user that the exam link is not available yet
    }
  })
  .catch(error => {
    console.error('Error fetching exam link:', error);
    // Handle errors - show an error message to the user
  });