import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/forgot-password/', { email });
      if (res.data.status === 'success') {
        toast.success('OTP sent');
        navigate('/otp-verification', { state: { email } });
      }
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleRequestOtp}>Send OTP</button>
      <ToastContainer />
    </div>
  );
};
export default ForgotPasswordForm;
