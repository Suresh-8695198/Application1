import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import StepProgressBar from '../components/StepProgressBar';

const ApplicationPage1 = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const defaultAcademicYear = `${currentYear}-${nextYear}`;
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: '', profilePicture: '/default-profile.png', name: 'User' });
  const [formData, setFormData] = useState({
    mode_of_study: '',
    programme_applied: '',
    course: '',
    medium: '',
    academic_year: defaultAcademicYear,
  });
  const [loading, setLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again.');
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:8000/api/user-profile/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.data.status === 'success') {
          setUserData({
            email: res.data.data.email || 'user@example.com',
            profilePicture: res.data.data.profilePicture || '/default-profile.png',
            name: res.data.data.name || 'User',
          });
        }
      } catch (err) {
        toast.error('Error fetching user data.');
        console.error(err.response?.data || err.message);
      }
    };

    const fetchFormData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/get-autofill-application/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.data.status === 'success' && res.data.data) {
          setFormData((prev) => ({
            ...prev,
            mode_of_study: res.data.data.mode_of_study || prev.mode_of_study,
            programme_applied: res.data.data.programme_applied || prev.programme_applied,
            course: res.data.data.course || prev.course,
            medium: res.data.data.medium || prev.medium,
            academic_year: res.data.data.academic_year || prev.academic_year,
          }));
        } 
      } catch (err) {
        toast.error('Error fetching form data.');
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAcademicYear = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/academic-year/');
        setFormData((prev) => ({
          ...prev,
          academic_year: res.data.academic_year || defaultAcademicYear,
        }));
      } catch (err) {
        toast.error('Error fetching academic year.');
        console.error(err.response?.data || err.message);
      }
    };

    fetchUserData();
    fetchFormData();
    fetchAcademicYear();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, medium: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login again.');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/application/page1/',
        formData,
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data.status === 'success') {
        toast.success('Application saved successfully!');
        setTimeout(() => navigate('/application/page2'), 2000);
      } else {
        toast.error(
          res.data.errors
            ? Object.values(res.data.errors).flat().join(', ')
            : res.data.message || 'Form save failed'
        );
      }
    } catch (err) {
      toast.error('Error submitting form.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const mediumOptions = [
    { value: '', label: 'Select Medium' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'English', label: 'English' },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#8b5cf6',
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: state.isSelected ? '#ffffff' : '#1f2937',
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1f2937',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(75, 85, 99, 0.7)',
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <StepProgressBar currentStep="/application/page1" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200/40"
        >
          <h3 className="text-3xl sm:text-3xl mb-5 font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-900 mb-6 sm:mb-4 tracking-tight text-center">
            Basic Information
          </h3>
          {loading && (
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"
              ></motion.div>
            </div>
          )}
          <div className="space-y-10">
            <div>
              <label className="block text-lg font-semibold text-violet-900 mb-3 font-roboto tracking-wide">
                Mode of Study <span className="text-red-500">*</span>
              </label>
              <input
                name="mode_of_study"
                placeholder="Enter Mode of Study (e.g., Full-Time)"
                value={formData.mode_of_study}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300/70 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-300 hover:shadow-purple-200/50"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-violet-900 mb-3 font-roboto tracking-wide">
                Programme Applied <span className="text-red-500">*</span>
              </label>
              <input
                name="programme_applied"
                placeholder="Enter Programme Applied (e.g., B.Sc. Computer Science)"
                value={formData.programme_applied}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300/70 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-300 hover:shadow-purple-200/50"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-violet-900 mb-3 font-roboto tracking-wide">
                Course <span className="text-red-500">*</span>
              </label>
              <input
                name="course"
                placeholder="Enter Course (e.g., Computer Science)"
                value={formData.course}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-300/70 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-300 hover:shadow-purple-200/50"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-violet-900 mb-3 font-roboto tracking-wide">
                Medium <span className="text-red-500">*</span>
              </label>
              <Select
                name="medium"
                value={mediumOptions.find((option) => option.value === formData.medium)}
                onChange={handleSelectChange}
                options={mediumOptions}
                styles={customSelectStyles}
                isDisabled={loading}
                className="w-full font-roboto"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-violet-900 Publicado por: mb-3 font-roboto tracking-wide">
                Academic Year
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                readOnly
                className="w-full p-4 bg-gray-100/70 backdrop-blur-sm rounded-xl border border-gray-300/70 shadow-sm cursor-not-allowed font-roboto font-medium text-lg text-gray-900"
              />
            </div>
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(107, 114, 128, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition duration-300 font-roboto font-bold text-lg shadow-lg"
              >
                Back to Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-300 disabled:to-indigo-300 transition duration-300 font-roboto font-bold text-lg flex items-center shadow-lg"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Next Step
                <ChevronRightIcon className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
      <style jsx>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif !important;
        }
        .font-roboto {
          font-family: 'Roboto', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default ApplicationPage1;