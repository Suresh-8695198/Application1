import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

const InputField = ({ name, type, placeholder, value, onChange, icon: Icon, error, isValid }) => (
  <div className="relative group">
    <div className="relative">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 sm:p-3.5 pl-11 sm:pl-12 pr-12 rounded-lg bg-white/80 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-400/70 shadow-sm group-hover:shadow-purple-300/50 font-nunito text-base sm:text-lg tracking-wide hover:bg-purple-50/50 backdrop-blur-sm"
        aria-label={name}
      />
      <Icon className="absolute left-3.5 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-600" />
      {isValid && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <CheckCircleIcon className="absolute right-3.5 sm:right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 drop-shadow-md" />
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <XCircleIcon className="absolute right-3.5 sm:right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 drop-shadow-md" />
        </motion.div>
      )}
    </div>
    {error && (
      <motion.p
        className="text-red-500 text-sm mt-2 font-nunito font-medium animate-fadeIn"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error}
      </motion.p>
    )}
  </div>
);

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const validateField = (name, value) => {
    let error = '';
    let valid = false;

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Invalid email format';
        else valid = true;
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else valid = true;
        break;
      default:
        break;
    }

    return { error, valid };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const { error, valid } = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setIsValid((prev) => ({ ...prev, [name]: valid }));
  };

  const handleLogin = async () => {
    const fields = ['email', 'password'];
    let hasError = false;
    const newErrors = {};
    const newIsValid = {};

    fields.forEach((field) => {
      const { error, valid } = validateField(field, form[field]);
      newErrors[field] = error;
      newIsValid[field] = valid;
      if (error || !form[field]) hasError = true;
    });

    setErrors(newErrors);
    setIsValid(newIsValid);

    if (hasError) {
      toast.error('Please fix the errors in the form.', {
        position: 'top-center',
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        className: 'bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-xl font-nunito',
        progressClassName: 'bg-gradient-to-r from-purple-600 to-indigo-500',
      });
      return;
    }

    setIsLoading(true);
    toast.info('Signing in...', {
      position: 'top-center',
      autoClose: 5000,
      className: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-xl font-nunito',
      progressClassName: 'bg-gradient-to-r from-purple-600 to-indigo-500',
      icon: (
        <motion.svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </motion.svg>
      ),
    });
    try {
      const res = await axios.post('http://127.0.0.1:4040/api/login/', {
        email: form.email,
        password: form.password,
      });
      if (res.data.status === 'success') {
        localStorage.setItem('token', res.data.token);
        toast.success('Login successful! Redirecting...', {
          position: 'top-center',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          className: 'bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl shadow-xl font-nunito',
          progressClassName: 'bg-gradient-to-r from-purple-600 to-indigo-500',
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        toast.error(res.data.message || 'Login failed.', {
          position: 'top-center',
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
          className: 'bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-xl font-nunito',
          progressClassName: 'bg-gradient-to-r from-purple-600 to-indigo-500',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error.', {
        position: 'top-center',
        icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        className: 'bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl shadow-xl font-nunito',
        progressClassName: 'bg-gradient-to-r from-purple-600 to-indigo-500',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-6 relative overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Nunito:wght@400;600&display=swap" rel="stylesheet" />
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute w-96 h-96 bg-purple-300/30 rounded-full -top-24 -left-24 filter blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3], x: [-30, 30, -30], y: [-30, 30, -30] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-indigo-300/30 rounded-full -bottom-20 -right-20 filter blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>
      {showSplash && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-purple-950 via-indigo-800 to-purple-900 flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 4, duration: 0.6 }}
        >
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              className="relative w-56 h-56"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <svg className="absolute w-56 h-56">
                <motion.circle
                  cx="112"
                  cy="112"
                  r="90"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="565"
                  strokeDashoffset="565"
                  animate={{ strokeDashoffset: 0, rotate: 360 }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="80"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="502"
                  strokeDashoffset="502"
                  animate={{ strokeDashoffset: 0, rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="10"
                  fill="#A855F7"
                  animate={{ x: [0, 20, -20, 0], y: [0, 20, -20, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="8"
                  fill="#C084FC"
                  animate={{ x: [0, -15, 15, 0], y: [0, -15, 15, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6B46C1', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#C084FC', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
              <img
                src="/Logo.png"
                alt="Periyar University Logo"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
              />
            </motion.div>
            <motion.h1
              className="mt-12 text-4xl font-bold text-white font-poppins tracking-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Centre for Distance and Online Education
            </motion.h1>
            <motion.p
              className="mt-3 text-base text-purple-200 font-poppins font-medium"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Empowering Minds, Shaping Futures
            </motion.p>
          </div>
        </motion.div>
      )}
      {!showSplash && (
        <motion.div
          className="bg-white/30 backdrop-blur-lg rounded-2xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden shadow-3d border border-purple-200/50 z-10"
          initial={{ y: 50, opacity: 0, rotateX: 0, rotateY: 0 }}
          animate={{ y: 0, opacity: 1, rotateX: 3, rotateY: 3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-purple-950 via-indigo-800 to-purple-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-purple-900/20"
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-400/30 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="mb-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              <img
                src="/Logo.png"
                alt="Periyar University Logo"
                className="w-56 h-56 sm:w-64 sm:h-64"
              />
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight font-poppins text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg font-medium leading-relaxed font-nunito text-center max-w-sm"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Sign in to continue your journey with Periyar University Online Education.
            </motion.p>
          </div>
          <div className="lg:w-1/2 p-6 sm:p-8 bg-white/95 rounded-b-2xl lg:rounded-r-2xl">
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 250 }}
            >
              <img src="/Logo.png" alt="Periyar University Logo" className="w-16 h-16 sm:w-18 sm:h-18" />
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 font-poppins"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Sign In
            </motion.h2>
            <div className="space-y-4">
              <InputField
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                icon={EnvelopeIcon}
                error={errors.email}
                isValid={isValid.email}
              />
              <InputField
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                icon={LockClosedIcon}
                error={errors.password}
                isValid={isValid.password}
              />
              <motion.button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full p-3 sm:p-3.5 rounded-lg text-white flex items-center justify-center shadow-lg font-nunito text-base sm:text-lg relative overflow-hidden transition-all duration-300 ${
                  isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400'
                }`}
                whileHover={{ scale: isLoading ? 1 : 1.05, boxShadow: isLoading ? '' : '0 0 20px rgba(168, 85, 247, 0.6)' }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                {isLoading && (
                  <motion.svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </motion.svg>
                )}
                <motion.span className="relative z-10">
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </motion.span>
                {!isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </motion.button>
              <div className="flex justify-between text-sm">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-purple-600 hover:text-purple-400 transition-all duration-300 font-nunito"
                >
                  Forgot Password?
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-purple-600 hover:text-purple-400 transition-all duration-300 font-nunito"
                >
                  Create an Account
                </button>
              </div>
            </div>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
          </div>
          <style jsx>{`
            .font-nunito {
              font-family: 'Nunito', sans-serif !important;
            }
            .font-poppins {
              font-family: 'Poppins', sans-serif !important;
            }
            .shadow-3d {
              box-shadow: 8px 8px 20px rgba(108, 99, 255, 0.2), -8px -8px 20px rgba(255, 255, 255, 0.8);
              transform: perspective(1200px) rotateX(3deg) rotateY(3deg);
            }
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            .animate-fadeIn {
              animation: fadeIn 0.5s ease-out;
            }
          `}</style>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
