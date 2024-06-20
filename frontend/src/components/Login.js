import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2 for error alerts
import "./Login.css"; // Import CSS for styles

const Login = ({ setLoggedIn, setRole }) => {
  const [email, setEmail] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedInState] = useState(false);

  // Effect to handle navigation after successful login
  // useEffect(() => {
  //     if (loggedIn) {
  //         navigate('/camera');
  //     }
  // }, [loggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Attempting to login with email:",
      email,
      "and registerNumber:",
      registerNumber
    );

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, registerNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful. User data:", data);

        localStorage.setItem("userid", data.registerNumber.toString());
        localStorage.setItem("username", `${data.firstName} ${data.lastName}`);
        localStorage.setItem("role", "users"); // Store the user's role
        localStorage.setItem("token", data.token);

        // Set logged-in state and role
        setLoggedIn(true);
        setRole("users");
        navigate("/camera");
        // Reset error if any
        setLoginError("");
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("Error logging in");
    }
  };

  // Function to display an alert using SweetAlert2
  const showAlert = (message) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      setLoginError("");
    });
  };

  return (
    <div className="bg">
      <h1 className="header">Welcome to our Platform</h1>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-3d"
            />
          </div>
          <div className="form-group">
            <label>Register Number</label>
            <input
              type="text"
              value={registerNumber}
              onChange={(e) => {
                const enteredValue = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);
                setRegisterNumber(enteredValue);
              }}
              required
              className="input-3d"
            />
          </div>
          <div className="button">
            <button type="submit">Login</button>
          </div>
        </form>
        {/* Display an alert if there is a login error */}
        {loginError && showAlert(loginError)}
      </div>
    </div>
  );
};

export default Login;
