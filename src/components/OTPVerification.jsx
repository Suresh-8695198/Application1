import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/verify-reset-otp/', { email, otp });
      if (res.data.status === 'success') {
        toast.success('OTP verified');
        navigate('/reset-password', { state: { email } });
      }
    } catch (err) {
      toast.error('OTP verification failed');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={handleVerify}>Verify</button>
      <ToastContainer />
    </div>
  );
};
export default OTPVerification;

