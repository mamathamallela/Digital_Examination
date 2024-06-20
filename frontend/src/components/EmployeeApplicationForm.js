import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "./employe.css";

const EmploymentApplicationForm = () => {
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
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef();
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [uploadPhoto, setUploadPhoto] = useState(null);

const handleUploadPhotoChange = (e) => {
  const selectedFile = e.target.files[0];
  setUploadPhoto(selectedFile);
};

  const handleCalendarClick = () => {
    setCalendarOpen(!isCalendarOpen);
  };

  const handleDocumentClick = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (inputValue.length <= 10) {
      setPhoneNumber(inputValue);
    }
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

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);

    setEmail(inputValue);

    if (!isValidEmail) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
    } else {
      setErrors({ ...errors, email: "" });
    }
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

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/submit-form",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setSubmissionMessage("Form submitted successfully!");
        resetForm();
      } else {
        setSubmissionMessage(
          "Email already exists; please enter another email."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionMessage("Error submitting form. Please try again.");
    }
  };

// This code demonstrates a basic example of how you might fetch data from your backend API

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/users/applications'); // Assuming this is the endpoint where your backend is serving data
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    // Further process the data as needed - e.g., display it in your UI
    displayApplications(data); // Example: displayApplications is a function to render data in UI
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // Handle the error condition (e.g., show error message to the user)
  }
};

// Call fetchData when your page loads or when needed to fetch data
fetchData();


  const validateForm = () => {
    if (!email || !isValidEmail(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return false;
    }
    return true;
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
    <div>
      <form onSubmit={handleSubmit} className="employment-form">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName">First Name*</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name*</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="gender">Gender*</label>
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
        </div>
        <div ref={calendarRef}>
          <label htmlFor="birthDate">Date of Birth*</label>
          <div onClick={handleCalendarClick}>
            <input
              type="text"
              id="birthDate"
              value={birthDate.toDateString()}
              readOnly
              required
            />
          </div>
          {isCalendarOpen && (
            <Calendar
              onChange={(date) => setBirthDate(date)}
              value={birthDate}
            />
          )}
        </div>
        <div className="q">
          <div className="text_field">
            <label htmlFor="phoneNumber">Phone Number*</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cityDistrict">City/District*</label>
            <input
              type="text"
              id="cityDistrict"
              value={cityDistrict}
              onChange={(e) => setCityDistrict(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="state">State*</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-field">
            <label htmlFor="zipcode">Zipcode*</label>
            <input
              type="text"
              id="zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              required
            />
          </div> */}

           <div className="form-field">
            <label htmlFor="zipcode">Zipcode*</label>
            <input
              type="text"
              id="zipcode"
              value={zipcode}
              onChange={handleZipcodeChange}
              required
            />
          </div> 

        </div>
        <div>
          <label htmlFor="resume">Upload Resume*</label>
          <input
            type="file"
            id="resume"
            accept=".pdf, .doc, .docx"
            onChange={handleResumeChange}
            required
          />
        </div>
        <div>
  <label htmlFor="uploadPhoto">Upload Photo</label>
  <input
    type="file"
    id="uploadPhoto"
    accept="image/*"
    onChange={handleUploadPhotoChange}
    required
  />
</div>

        <button type="submit">Submit</button>
      </form>

      {/* Display submission message */}
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
};

export default EmploymentApplicationForm;
