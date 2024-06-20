import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OldPasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const userId = localStorage.getItem('userid');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/users/validateOldPasswordAndRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, userId }),
      });
      const data = await response.json();
      if (response.ok && data.valid && data.role === 'admin') {
        setShowNewPasswordFields(true);
      } else {
        setShowNewPasswordFields(false);
        throw new Error('Invalid old password or insufficient permissions.');
      }
    } catch (error) {
      console.error('Error validating old password:', error.message);
      toast.error(error.message);
    }
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('/api/users/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, userId }),
      });
      if (response.ok) {
        toast.success('Password updated successfully!');
        setTimeout(() => {
          navigate('/admin');
        }, 2000); // Delay navigation for 2 seconds
      } else {
        throw new Error('Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
      toast.error(error.message);
    }
  };

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <ToastContainer />
      {!showNewPasswordFields ? (
        <form onSubmit={handleSubmit} style={{ width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: '10%', boxShadow: '20px 20px 20px 20px grey', padding: '30px' }}>
          <label>
            Old Password:
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => handleChange(event, setOldPassword)}
              required
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#007bff', color: '#fff' }}>Submit</button>
        </form>
      ) : (
        <form onSubmit={handleNewPasswordSubmit} style={{ width: '30%', marginLeft: 'auto', marginRight: 'auto', marginTop: '12%', boxShadow: '20px 20px 20px 20px grey', padding: '30px' }}>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(event) => handleChange(event, setNewPassword)}
              required
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => handleChange(event, setConfirmPassword)}
              required
              style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </label>
          <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#007bff', color: '#fff', marginTop: '10px' }}>Update Password</button>
        </form>
      )}
    </div>
  );
}

export default OldPasswordForm;
