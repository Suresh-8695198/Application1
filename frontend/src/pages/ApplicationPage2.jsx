import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StepProgressBar from '../components/StepProgressBar';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ArrowLeft, RefreshCcw, ArrowRight, ArrowUp } from 'lucide-react';

// Custom Checkbox Component
const CustomCheckbox = ({ name, checked, onChange, disabled, label, section }) => {
  const colorStyles = {
    personal: {
      border: 'border-blue-400',
      checkedBg: 'bg-blue-600',
      checkedBorder: 'border-blue-600',
      focusRing: 'focus:ring-blue-500',
    },
    parent: {
      border: 'border-green-400',
      checkedBg: 'bg-green-600',
      checkedBorder: 'border-green-600',
      focusRing: 'focus:ring-green-500',
    },
    additional: {
      border: 'border-purple-400',
      checkedBg: 'bg-purple-600',
      checkedBorder: 'border-purple-600',
      focusRing: 'focus:ring-purple-500',
    },
    communication: {
      border: 'border-indigo-400',
      checkedBg: 'bg-indigo-600',
      checkedBorder: 'border-indigo-600',
      focusRing: 'focus:ring-indigo-500',
    },
    permanent: {
      border: 'border-red-400',
      checkedBg: 'bg-red-600',
      checkedBorder: 'border-red-600',
      focusRing: 'focus:ring-red-500',
    },
  };

  const colors = colorStyles[section] || colorStyles.personal; // Fallback to personal if section not specified

  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`peer h-6 w-6 rounded-md border-2 ${colors.border} focus:ring-2 ${colors.focusRing} transition duration-200 appearance-none checked:${colors.checkedBg} checked:${colors.checkedBorder}`}
        />
        <svg
          className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 top-1 left-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-800 font-roboto text-lg">{label}</span>
    </label>
  );
};

const ApplicationPage2 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    deb_id: '',
    abc_id: '',
    name_initial: '',
    dob: null,
    aadhaar_no: '',
    name_as_aadhaar: '',
    parent_selected: true,
    guardian_selected: false,
    father_name: '',
    father_occupation: '',
    mother_name: '',
    mother_occupation: '',
    guardian_name: '',
    guardian_occupation: '',
    nationality: '',
    religion: '',
    community: '',
    mother_tongue: '',
    differently_abled: '',
    disability_type: '',
    blood_group: '',
    access_internet: '',
    comm_pincode: '',
    comm_district: '',
    comm_state: '',
    comm_country: '',
    comm_town: '',
    comm_area: '',
    same_as_comm: false,
    perm_pincode: '',
    perm_district: '',
    perm_state: '',
    perm_country: '',
    perm_town: '',
    perm_area: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highlightInfo, setHighlightInfo] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const debIdRef = useRef(null);
  const abcIdRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchUserData = async (retries = 3, delay = 1000) => {
      if (!token) {
        toast.error('Please login again.');
        navigate('/login');
        return;
      }
      if (!mounted) return;
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/get-autofill-application/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (mounted && res.data.status === 'success' && res.data.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data.data,
            dob: res.data.data.dob ? new Date(res.data.data.dob) : null,
            parent_selected: res.data.data.parent_selected ?? prev.parent_selected,
            guardian_selected: res.data.data.guardian_selected ?? prev.guardian_selected,
            same_as_comm: res.data.data.same_as_comm ?? prev.same_as_comm,
            differently_abled: res.data.data.differently_abled || prev.differently_abled,
          }));
        }
      } catch (err) {
        if (mounted && err.response?.status === 404 && retries > 0) {
          toast.error(`Autofill endpoint not found, retrying... (${retries} attempts left)`);
          setTimeout(() => fetchUserData(retries - 1, delay * 2), delay);
        } else if (mounted) {
          toast.error(err.response?.status === 404 ? 'Autofill endpoint not available.' : 'Error fetching user data.');
          console.error(err.response?.data || err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUserData();
    return () => {
      mounted = false;
    };
  }, [navigate, token]);

  useEffect(() => {
    if (formData.same_as_comm) {
      setFormData((prev) => ({
        ...prev,
        perm_pincode: prev.comm_pincode,
        perm_district: prev.comm_district,
        perm_state: prev.comm_state,
        perm_country: prev.comm_country,
        perm_town: prev.comm_town,
        perm_area: prev.comm_area,
      }));
    }
  }, [
    formData.same_as_comm,
    formData.comm_pincode,
    formData.comm_district,
    formData.comm_state,
    formData.comm_country,
    formData.comm_town,
    formData.comm_area,
  ]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      'deb_id', 'abc_id', 'name_initial', 'dob', 'aadhaar_no', 'name_as_aadhaar',
      'nationality', 'religion', 'community', 'mother_tongue', 'differently_abled',
      'blood_group', 'access_internet', 'comm_pincode', 'comm_district', 'comm_state',
      'comm_country', 'comm_town', 'comm_area',
    ];
    if (formData.parent_selected) {
      requiredFields.push('father_name', 'father_occupation', 'mother_name', 'mother_occupation');
    } else if (formData.guardian_selected) {
      requiredFields.push('guardian_name', 'guardian_occupation');
    }
    if (!formData.same_as_comm) {
      requiredFields.push('perm_pincode', 'perm_district', 'perm_state', 'perm_country', 'perm_town', 'perm_area');
    }
    if (formData.differently_abled === 'Yes') {
      requiredFields.push('disability_type');
    }
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });
    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob.toISOString().split('T')[0])) {
      newErrors.dob = 'Date of Birth must be in YYYY-MM-DD format';
    }
    if (formData.aadhaar_no && (formData.aadhaar_no.length !== 12 || !/^\d{12}$/.test(formData.aadhaar_no))) {
      newErrors.aadhaar_no = 'Aadhaar Number must be exactly 12 digits';
    }
    if (formData.comm_area && !['Rural', 'Urban'].includes(formData.comm_area)) {
      newErrors.comm_area = 'Communication Area must be Rural or Urban';
    }
    if (formData.perm_area && !['Rural', 'Urban'].includes(formData.perm_area)) {
      newErrors.perm_area = 'Permanent Area must be Rural or Urban';
    }
    if (formData.blood_group && formData.blood_group.length > 10) {
      newErrors.blood_group = 'Blood Group must be 10 characters or less';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value || '',
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFormData((prev) => ({ ...prev, dob: date }));
    setErrors((prev) => ({ ...prev, dob: '' }));
  }, []);

  const handleSelectChange = useCallback((selectedOption, { name }) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    if (name === 'parent_selected') {
      setFormData((prev) => ({
        ...prev,
        parent_selected: checked,
        guardian_selected: !checked,
        guardian_name: checked ? prev.guardian_name : '',
        guardian_occupation: checked ? prev.guardian_occupation : '',
      }));
    } else if (name === 'guardian_selected') {
      setFormData((prev) => ({
        ...prev,
        guardian_selected: checked,
        parent_selected: !checked,
        father_name: checked ? prev.father_name : '',
        father_occupation: checked ? prev.father_occupation : '',
        mother_name: checked ? prev.mother_name : '',
        mother_occupation: checked ? prev.mother_occupation : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setFormData({
      deb_id: '',
      abc_id: '',
      name_initial: '',
      dob: null,
      aadhaar_no: '',
      name_as_aadhaar: '',
      parent_selected: true,
      guardian_selected: false,
      father_name: '',
      father_occupation: '',
      mother_name: '',
      mother_occupation: '',
      guardian_name: '',
      guardian_occupation: '',
      nationality: '',
      religion: '',
      community: '',
      mother_tongue: '',
      differently_abled: '',
      disability_type: '',
      blood_group: '',
      access_internet: '',
      comm_pincode: '',
      comm_district: '',
      comm_state: '',
      comm_country: '',
      comm_town: '',
      comm_area: '',
      same_as_comm: false,
      perm_pincode: '',
      perm_district: '',
      perm_state: '',
      perm_country: '',
      perm_town: '',
      perm_area: '',
    });
    setErrors({});
    toast.success('Form reset successfully!');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields', {
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #dc2626',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          fontWeight: '500',
        },
        icon: '❌',
        duration: 4000,
      });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        dob: formData.dob ? formData.dob.toISOString().split('T')[0] : '',
      };
      const res = await axios.post('http://localhost:8000/api/application/page2/', payload, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.status === 200 && res.data.message) {
        toast.success('Page 2 saved successfully!');
        setTimeout(() => navigate('/application/page3'), 1000);
      } else {
        toast.error(res.data.message || 'Submission failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Error submitting form';
      toast.error(errorMsg);
      console.error('Error response:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, navigate, token, validateForm]);

  const handleInputFocus = useCallback((field) => {
    if (field === 'deb_id' || field === 'abc_id') {
      setHighlightInfo(true);
      setTimeout(() => setHighlightInfo(false), 5000);
    }
  }, []);

  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToTop = useCallback(() => {
    setIsScrolling(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsScrolling(false);
    }, 800);
  }, []);

  const selectOptions = {
    differently_abled: [
      { value: '', label: 'Select Option' },
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    access_internet: [
      { value: '', label: 'Select Option' },
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    comm_area: [
      { value: '', label: 'Select Area' },
      { value: 'Rural', label: 'Rural' },
      { value: 'Urban', label: 'Urban' },
    ],
    perm_area: [
      { value: '', label: 'Select Area' },
      { value: 'Rural', label: 'Rural' },
      { value: 'Urban', label: 'Urban' },
    ],
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Toaster position="top-right" />
      <div className="w-full max-w-7xl mx-auto">
        <StepProgressBar currentStep="/application/page2" />
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-purple-200/40">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-4xl font-extrabold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900 tracking-tight text-center">
              Application Form - Personal Details
            </h2>
            <motion.button
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.2, boxShadow: '0 0 25px rgba(234, 179, 8, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-8 top-8 w-12 h-12 flex items-center justify-center rounded-full text-white font-inter font-bold text-xl transition duration-300
                ${
                  highlightInfo
                    ? 'bg-yellow-500 shadow-yellow-500/50 animate-bounce infinite ring-4 ring-yellow-400'
                    : 'bg-purple-900'
                }`}
              title="Click for DEB ID and ABC ID instructions"
            >
              i
            </motion.button>
          </div>
          <p className="text-lg font-roboto mb-6 text-center">
            <span className="text-red-600 font-bold">Please fill in all required fields.</span>{' '}
            <span className="text-yellow-600 font-bold">For help with DEB ID or ABC ID, click the " <span className="text-red-600 font-bold">i</span> " button above for instructions.</span>
          </p>
          {loading && (
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"
              ></motion.div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-6 tracking-tight">
                  Personal Information
                </h3>
                {[
                  { name: 'deb_id', label: 'DEB ID', type: 'text', ref: debIdRef },
                  { name: 'abc_id', label: 'ABC ID', type: 'text', ref: abcIdRef },
                  { name: 'name_initial', label: 'Name with Initial', type: 'text' },
                  { name: 'aadhaar_no', label: 'Aadhaar Number', type: 'text', pattern: '\\d{0,12}' },
                  { name: 'name_as_aadhaar', label: 'Name as per Aadhaar', type: 'text' },
                ].map(({ name, label, type, ref, pattern }) => (
                  <div key={name}>
                    <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => handleInputFocus(name)}
                      disabled={loading}
                      ref={ref}
                      pattern={pattern}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-blue-400 hover:shadow-blue-200/50"
                    />
                    {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formData.dob}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Date"
                    disabled={loading}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="scroll"
                    className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-blue-400 hover:shadow-blue-200/50"
                    wrapperClassName="w-full"
                    popperClassName="custom-datepicker-popper"
                    calendarClassName="custom-datepicker"
                  />
                  {errors.dob && <p className="text-red-500 text-base mt-2 font-roboto">{errors.dob}</p>}
                </div>
              </div>
              <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-green-100/50">
                <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-6 tracking-tight">
                  Parent/Guardian Information
                </h3>
                <div className="flex items-center space-x-6">
                  <CustomCheckbox
                    name="parent_selected"
                    checked={formData.parent_selected}
                    onChange={handleCheckboxChange}
                    disabled={loading}
                    label="Parent"
                    section="parent"
                  />
                  <CustomCheckbox
                    name="guardian_selected"
                    checked={formData.guardian_selected}
                    onChange={handleCheckboxChange}
                    disabled={loading}
                    label="Guardian"
                    section="parent"
                  />
                </div>
                {formData.parent_selected && (
                  <>
                    {[
                      { name: 'father_name', label: 'Father’s Name' },
                      { name: 'father_occupation', label: 'Father’s Occupation' },
                      { name: 'mother_name', label: 'Mother’s Name' },
                      { name: 'mother_occupation', label: 'Mother’s Occupation' },
                    ].map(({ name, label }) => (
                      <div key={name}>
                        <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-green-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-green-400 hover:shadow-green-200/50"
                        />
                        {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                      </div>
                    ))}
                  </>
                )}
                {formData.guardian_selected && (
                  <>
                    {[
                      { name: 'guardian_name', label: 'Guardian’s Name' },
                      { name: 'guardian_occupation', label: 'Guardian’s Occupation' },
                    ].map(({ name, label }) => (
                      <div key={name}>
                        <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-green-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-green-400 hover:shadow-green-200/50"
                        />
                        {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6 tracking-tight">
                  Additional Information
                </h3>
                {[
                  { name: 'nationality', label: 'Nationality', type: 'text' },
                  { name: 'religion', label: 'Religion', type: 'text' },
                  { name: 'community', label: 'Community', type: 'text' },
                  { name: 'mother_tongue', label: 'Mother Tongue', type: 'text' },
                  { name: 'blood_group', label: 'Blood Group', type: 'text', maxLength: 10 },
                ].map(({ name, label, type, maxLength }) => (
                  <div key={name}>
                    <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={loading}
                      maxLength={maxLength}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-400 hover:shadow-purple-200/50"
                    />
                    {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                    Differently Abled <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="differently_abled"
                    value={selectOptions.differently_abled.find((option) => option.value === formData.differently_abled)}
                    onChange={(option) => handleSelectChange(option, { name: 'differently_abled' })}
                    options={selectOptions.differently_abled}
                    styles={customSelectStyles}
                    isDisabled={loading}
                    className="font-roboto"
                    classNamePrefix="select"
                  />
                  {errors.differently_abled && <p className="text-red-500 text-base mt-2 font-roboto">{errors.differently_abled}</p>}
                </div>
                {formData.differently_abled === 'Yes' && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                      Type of Disability <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="disability_type"
                      value={formData.disability_type}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-400 hover:shadow-purple-200/50"
                    />
                    {errors.disability_type && <p className="text-red-500 text-base mt-2 font-roboto">{errors.disability_type}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                    Access to Internet <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="access_internet"
                    value={selectOptions.access_internet.find((option) => option.value === formData.access_internet)}
                    onChange={(option) => handleSelectChange(option, { name: 'access_internet' })}
                    options={selectOptions.access_internet}
                    styles={customSelectStyles}
                    isDisabled={loading}
                    className="font-roboto"
                    classNamePrefix="select"
                  />
                  {errors.access_internet && <p className="text-red-500 text-base mt-2 font-roboto">{errors.access_internet}</p>}
                </div>
              </div>
              <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 mb-6 tracking-tight">
                  Communication Address
                </h3>
                {[
                  { name: 'comm_pincode', label: 'Pincode', type: 'text', pattern: '\\d{0,6}' },
                  { name: 'comm_district', label: 'District', type: 'text' },
                  { name: 'comm_state', label: 'State', type: 'text' },
                  { name: 'comm_country', label: 'Country', type: 'text' },
                  { name: 'comm_town', label: 'Town/Village', type: 'text' },
                ].map(({ name, label, type, pattern }) => (
                  <div key={name}>
                    <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={loading}
                      pattern={pattern}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-indigo-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-indigo-400 hover:shadow-indigo-200/50"
                    />
                    {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="comm_area"
                    value={selectOptions.comm_area.find((option) => option.value === formData.comm_area)}
                    onChange={(option) => handleSelectChange(option, { name: 'comm_area' })}
                    options={selectOptions.comm_area}
                    styles={customSelectStyles}
                    isDisabled={loading}
                    className="font-roboto"
                    classNamePrefix="select"
                  />
                  {errors.comm_area && <p className="text-red-500 text-base mt-2 font-roboto">{errors.comm_area}</p>}
                </div>
              </div>
              <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6 tracking-tight">
                  Permanent Address
                </h3>
                <CustomCheckbox
                  name="same_as_comm"
                  checked={formData.same_as_comm}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                  label="Same as Communication Address"
                  section="permanent"
                />
                {[
                  { name: 'perm_pincode', label: 'Pincode', type: 'text', pattern: '\\d{0,6}' },
                  { name: 'perm_district', label: 'District', type: 'text' },
                  { name: 'perm_state', label: 'State', type: 'text' },
                  { name: 'perm_country', label: 'Country', type: 'text' },
                  { name: 'perm_town', label: 'Town/Village', type: 'text' },
                ].map(({ name, label, type, pattern }) => (
                  <div key={name}>
                    <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      disabled={formData.same_as_comm || loading}
                      pattern={pattern}
                      className={`w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-red-300 shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-red-400 hover:shadow-red-200/50 ${
                        formData.same_as_comm ? 'bg-gray-100/70 cursor-not-allowed' : ''
                      }`}
                    />
                    {errors[name] && <p className="text-red-500 text-base mt-2 font-roboto">{errors[name]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 font-roboto mb-3 tracking-wide">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="perm_area"
                    value={selectOptions.perm_area.find((option) => option.value === formData.perm_area)}
                    onChange={(option) => handleSelectChange(option, { name: 'perm_area' })}
                    options={selectOptions.perm_area}
                    styles={customSelectStyles}
                    isDisabled={formData.same_as_comm || loading}
                    className="font-roboto"
                    classNamePrefix="select"
                  />
                  {errors.perm_area && <p className="text-red-500 text-base mt-2 font-roboto">{errors.perm_area}</p>}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-10 space-x-4">
              <motion.button
                type="button"
                onClick={() => navigate('/application/page1')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(107, 114, 128, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition duration-300 font-roboto font-bold text-lg shadow-lg flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </motion.button>
              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition duration-300 font-roboto font-bold text-lg shadow-lg flex items-center"
              >
                <RefreshCcw className="h-5 w-5 mr-2" />
                Reset
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-300 disabled:to-indigo-300 transition duration-300 font-roboto font-bold text-lg shadow-lg flex items-center"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Save and Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
          </form>
        </div>
      </div>
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8"
          >
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(139, 92, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 0.8, y: 0 }}
              exit={{ scale: 0.7, y: 20 }}
              className="bg-white/95 backdrop-blur-2xl rounded-2xl p-10 w-full shadow-2xl border border-purple-300/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 to-indigo-100/30" />
              <h3 className="text-3xl font-extrabold font-inter bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900 mb-8 tracking-tight relative z-10">
                DEB ID & ABC ID Instructions
              </h3>
              <div className="space-y-8 relative z-10">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 font-inter">DEB ID</h4>
                  <p className="text-gray-700 font-inter font-medium text-lg">
                    The DEB ID (Digital Education Board ID) is a unique identifier for students registered with the Digital Education Board. To obtain your DEB ID:
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Visit the official DEB portal at <a href="https://www.deb.gov.in" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">www.deb.gov.in</a>.</li>
                      <li>Register with your personal details and educational qualifications.</li>
                      <li>Upon successful registration, you will receive a 12-digit DEB ID.</li>
                      <li>
                        Watch the tutorial: <a href="https://www.youtube.com/watch?v=DEB_ID_Tutorial" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">DEB ID Creation Guide</a>
                      </li>
                    </ul>
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 font-inter">ABC ID</h4>
                  <p className="text-gray-700 font-inter font-medium text-lg">
                    The ABC ID (Academic Bank of Credits ID) is required for credit accumulation and transfer. To create an ABC ID:
                    <ul className="list-disc pl-6 mt-3 space-y-2">
                      <li>Go to the ABC portal at <a href="https://www.abc.gov.in" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">www.abc.gov.in</a>.</li>
                      <li>Sign up using your Aadhaar number or other valid ID.</li>
                      <li>Complete the verification process to receive your 12-digit ABC ID.</li>
                      <li>
                        Watch the tutorial: <a href="https://www.youtube.com/watch?v=ABC_ID_Tutorial" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">ABC ID Creation Guide</a>
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-8 relative z-10">
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 font-inter font-bold text-lg shadow-lg"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        .font-roboto {
          font-family: 'Roboto', sans-serif;
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
        }
        .custom-datepicker {
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(4px);
          font-family: 'Roboto', sans-serif;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background: linear-gradient(to right, #7c3aed, #4c1d95);
          border-bottom: none;
          border-radius: 0.75rem 0.75rem 0 0;
          padding: 12px 0;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
        }
        .react-datepicker__day {
          color: #1f2937;
          border-radius: 0.5rem;
          margin: 4px;
          padding: 6px;
        }
        .react-datepicker__day:hover {
          background-color: rgba(139, 92, 246, 0.2);
          color: #1f2937;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #8b5cf6;
          color: white;
          font-weight: 600;
        }
        .react-datepicker__triangle {
          display: none;
        }
        .react-datepicker__navigation {
          top: 12px;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
        .custom-datepicker-popper {
          z-index: 50;
        }
        .custom-datepicker {
          font-family: 'Roboto', sans-serif;
          font-size: 16px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0, 118, 255, 0.2);
        }
        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background-color: white;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 4px 0;
        }
        .react-datepicker__month-option,
        .react-datepicker__year-option {
          padding: 8px 12px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .react-datepicker__month-option:hover,
        .react-datepicker__year-option:hover {
          background-color: #e0f2fe;
          color: rgb(85, 3, 161);
        }
        .react-datepicker__month-option--selected,
        .react-datepicker__year-option--selected {
          background-color: rgb(82, 4, 206);
          color: white;
          border-radius: 100%;
          font-weight: 600;
        }
      `}</style>
    </motion.div>
  );
};

export default ApplicationPage2;