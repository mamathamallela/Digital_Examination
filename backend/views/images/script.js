fetch('api/users/exam-link')
  .then(response => response.json())
  .then(data => {
    const statusElement = document.getElementById('status');

    if (data.link) {
      if (data.message === 'Exam link not available yet') {
        // If the link is not available yet, display a message
        statusElement.textContent = data.message;
      } else if (data.message === 'Exam link expired') {
        // If the link has expired, display a message
        statusElement.textContent = data.message;
      } else {
        // If the link exists and it's within the allowed time, show the link but do not redirect
        statusElement.innerHTML = `Exam link available: <a href="${data.link}">${data.link}</a>`;
      }
    } else {
      // If there's no link, display a general message
      statusElement.textContent = 'Exam link not available';
    }
  })
  .catch(error => {
    console.error('Error fetching exam link status:', error);
    const statusElement = document.getElementById('status');
    statusElement.textContent = 'Failed to fetch exam link status';
  });