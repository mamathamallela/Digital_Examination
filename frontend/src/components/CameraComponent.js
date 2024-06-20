import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const CaptureImage = ({ registerNumber }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const captureAndSaveImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    if (imageSrc) {
      const blob = dataURItoBlob(imageSrc);
      try {
        const formData = new FormData();
        formData.append('image', blob);
        // formData.append('registerNumber', registerNumber);

        // Append the registerNumber retrieved from local storage
      formData.append('registerNumber', localStorage.getItem('userid'));



        await axios.post('http://192.168.30.104:8000/api/users/uploadImage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Optionally, handle success response
      } catch (error) {
        console.error('Error uploading image:', error);
        // Handle error
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
          <button onClick={captureAndSaveImage}>Capture Image</button>
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