import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const handleReset = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/reset-password/', {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      if (res.data.status === 'success') {
        toast.success('Password reset successful');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      toast.error('Password reset failed');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
      <button onClick={handleReset}>Reset Password</button>
      <ToastContainer />
    </div>
  );
};
export default ResetPasswordForm;
