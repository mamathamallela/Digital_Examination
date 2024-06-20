import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptureImage = ({ registerNumber }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); 

  const captureAndSaveImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  
    if (imageSrc) {
      const blob = dataURItoBlob(imageSrc);
      try {
        const formData = new FormData();
        formData.append('image', blob);
        formData.append('registerNumber', localStorage.getItem('userid'));
  
        // Make the POST request to upload the image
        const response = await axios.post('api/users/uploadCameraImage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        console.log('Image upload successful');
  
        // Only navigate to the user page if the image upload is successful
        if (response.status === 200) {
          navigate('/user');
          console.log('Navigating to /user page');
        }
      } catch (error) {
        console.log('Error uploading image:', error);
        // Handle error: you can display an error message to the user here
      }
    }
  };
  

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

 
  
  
  

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Digital Examination System</h2>
      <div style={{ borderBottom: '3px solid blue', width: '100%', maxWidth: '1800px' }}></div>
      <h3>Face Recognition</h3>
      {/* <h3 style={{ borderBottom: '1px solid blue', width: '80%', maxWidth: '600px', paddingBottom: '10px' }}>Face Recognition</h3> */}
      <div style={{ textAlign: 'left', borderBottom: '3px solid blue', width: '100%', maxWidth: '1800px' }}>
        <p style={{color:"red",fontSize:"30px",fontWeight:"bold"}}>Instructions:</p>
        
        <p>&#8226; Face recognition features will be utilized for identity verification during the exam.</p>
        <p>&#8226; Ensure your webcam is functioning properly before attending the exam.</p>
        <p>&#8226; To start the examination, ensure proper lighting and camera positioning.</p>
      </div>
      {/* <hr style={{ width: '80%', margin: '20px auto' }} /> */}
      <div style={{ display: 'flex', justifyContent:'center',  width: '80%', maxWidth: '800px',padding:'12px' }}>
        <div style={{  flex: '1' }}>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" width={480} height={360} />
          <button
  onClick={captureAndSaveImage}
  style={{
    padding: '10px 20px',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  }}
>
  Capture Image
</button>

          {/* <div style={{ borderBottom: '3px solid blue', width: '100%', maxWidth: '1800px' }}></div> */}
          
        </div>
        <div style={{  flex: '1',marginLeft:'20px' }}>
          {image && <img src={image} alt="Captured" style={{ width: '480px', height: '360px', marginBottom: '10px' }} />}
          
          {/* {image && <button onClick={saveImage}>Save Image</button>} */}
        </div>
      </div>
      <div style={{ textAlign: 'left', borderTop: '3px solid blue',  width: '100%', maxWidth: '1800px' }}>
      <p style={{ textAlign: 'left', fontSize:'20px',color:'blue' }}>
            You must allow your browser to access your web-camera. Please do this following setting in Google Chrome or Microsoft Edge to ensure that the permissions are properly enabled.
          </p>
      </div>
      
    </div>
  );
};

export default CaptureImage;