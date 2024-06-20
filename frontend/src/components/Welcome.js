import React from 'react';
import "./signup.css"

const Welcome = () => {
  return (
    <div className='container'>
      <h1>Welcome to Our Organization</h1>
      <a href='/signup'><button>Sign Up</button></a>
      <a href='/login'><button>Log In</button></a>
    </div>
  );
};

export default Welcome;
