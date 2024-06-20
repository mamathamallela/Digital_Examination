import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Welcome from './components/Welcome';
// import SignUpForm from './components/SignUp';
import Login from './components/Login';
import AdminComponent from './components/AdminPage';
import UserComponent from './components/UserPage';
import EmploymentApplicationForm from './components/EmployeeApplicationForm';
import CameraComponent from './components/CameraComponent';




function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Routes>
         <Route path='/' element={<EmploymentApplicationForm />}/>
         {/* <Route path='/signup' element={<SignUpForm />}/> */}
         <Route path='/login' element={<Login />}/>
         <Route path='/admin' element={<AdminComponent />}/>
         <Route path='/user' element={<UserComponent />}/>
         <Route path='/camera' element={<CameraComponent />}/>
                      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
