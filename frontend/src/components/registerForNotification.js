import React, { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./employe.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles

const EmploymentApplicationForm = () => {
  const { notificationId, notificationText } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [resume, setResume] = useState(null);
  const [setIsCalendarOpen] = useState(false);
  const calendarRef = useRef();
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [uploadPhoto, setUploadPhoto] = useState(null);
 
  // const notify = () => toast("Submitted Successfully!");



const handleUploadPhotoChange = (e) => {
  const selectedFile = e.target.files[0];
  setUploadPhoto(selectedFile);
};

// const handleCalendarClick = () => {
//   setIsCalendarOpen(!isCalendarOpen);
// };

useEffect(() => {
  const handleDocumentClick = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setIsCalendarOpen(false);
    }
  };

  document.addEventListener("click", handleDocumentClick);

  return () => {
    document.removeEventListener("click", handleDocumentClick);
  };
}, [setIsCalendarOpen]); // Include calendarRef in the dependency array



  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    const formattedValue = inputValue.slice(0, 10); // Limit to 10 digits
    setPhoneNumber(formattedValue);
  };
  
 
  const handleZipcodeChange = (e) => {
    console.log('Handling zipcode change...');
    const inputValue = e.target.value.replace(/\D/g, '');
    console.log('Cleaned value:', inputValue);
    if (inputValue.length <= 6) {
      console.log('Updating state with zipcode:', inputValue);
      setZipcode(inputValue);
    }
  };

  // const handleEmailChange = (e) => {
  //   const inputValue = e.target.value;
  //   const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

  //   setEmail(inputValue);

  //   if (!isValidEmail) {
  //     setErrors({ ...errors, email: "Please enter a valid email address" });
  //   } else {
  //     setErrors({ ...errors, email: "" });
  //   }
  // };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
    setErrors({ ...errors, email: isValidEmail ? '' : "Please enter a valid email address" });
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    setResume(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const formattedBirthDate = birthDate.toISOString().split("T")[0];

    const isValid = validateForm();
    if (!isValid) {
      console.error("Invalid form submission");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("gender", gender);
    formData.append("birth_date", formattedBirthDate);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);
    formData.append("city_district", cityDistrict);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    formData.append("uploadresume", resume);
    formData.append("uploadphoto", uploadPhoto);
    formData.append("notificationId", notificationId);
    formData.append("notificationText", notificationText);

    try {
      const response = await fetch(
        "/api/users/submit-form",
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        setSubmissionMessage(`Error: ${errorMessage}`);
        return;
      }
  
      setSubmissionMessage("Form submitted successfully!");
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionMessage("Error submitting form. Please try again.");
    }
  };

  const validateForm = () => {
    // let isValid = true;
    const errors = {};

   // Validate phone number
  if (phoneNumber.length !== 10) {
    setErrors({ phoneNumber: "Please enter a 10-digit phone number." });
    return;
  }

    if (!email || !isValidEmail(email)) {
      setErrors({ ...errors, email: isValidEmail ? '': "Please enter a valid email address" });
      return isValidEmail;
    }
    return true;
    // return isValid;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setBirthDate(new Date());
    setPhoneNumber("");
    setEmail("");
    setCityDistrict("");
    setState("");
    setZipcode("");
    setResume(null);
    setErrors({});
  };


  return (
    <div className="bg">
      <div className="centered-text">
        <img src="https://img.freepik.com/free-vector/young-girl-using-tablet-education_1308-77988.jpg?size=626&ext=jpg&ga=GA1.1.1227489891.1707733392&semt=ais" alt="" className="left-image" />
        <h3>Registration For {notificationText}:</h3>
      </div>
      <form onSubmit={handleSubmit} className="employment-form">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">First Name ***</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name ***</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="gender">Gender ***</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="birthDate">Date of Birth ***</label>
            <div>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                maxDate={new Date()} // Prevent selection of future dates
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />
            </div>
          </div>
    </div>
        <div className="form-row">
          <div className="form-field">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>
          <div className="form-field">
            <label htmlFor="email">Email ***</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cityDistrict">City/District ***</label>
            <input
              type="text"
              id="cityDistrict"
              value={cityDistrict}
              onChange={(e) => setCityDistrict(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="state">State ***</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="zipcode">Zipcode ***</label>
            <input
              type="text"
              id="zipcode"
              value={zipcode}
              onChange={handleZipcodeChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="resume">Upload Resume ***</label>
            <input
              type="file"
              id="resume"
              accept=".pdf, .doc, .docx"
              onChange={handleResumeChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="uploadPhoto">Upload Photo ***</label>
            <input
              type="file"
              id="uploadPhoto"
              accept="image/*"
              onChange={handleUploadPhotoChange}
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="green-theme" // Use a class name to target the container
          />
        </div>
      </form>

      
     {/* Display submission message */}
{submissionMessage && <p className={submissionMessage.startsWith('Error') ? 'error-message' : 'success-message'}>{submissionMessage}</p>}

    </div>
  );
};

export default EmploymentApplicationForm;
