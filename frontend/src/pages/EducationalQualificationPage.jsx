import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ArrowLeft, ArrowRight, ArrowUp, Info } from 'lucide-react';
import StepProgressBar from '../components/StepProgressBar';
import QualificationsAndSemesters from './QualificationsAndSemesters';
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="p-6 bg-white rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600">Something Went Wrong</h2>
            <p className="mt-2 text-gray-600">Please try refreshing the page or contact support.</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-red-500">Error Details</summary>
                <pre className="mt-2 text-sm text-gray-700">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const EducationalQualificationPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    email: '',
    name_initial: '',
    qualifications: [
      { course: 'S.S.L.C', institute_name: '', board: '', subject_studied: '', reg_no: '', percentage: '', month_year: '', mode_of_study: '', sslc_marksheet_url: '', uploadProgress: 0 },
      { course: 'HSC', institute_name: '', board: '', subject_studied: '', reg_no: '', percentage: '', month_year: '', mode_of_study: '', hsc_marksheet_url: '', uploadProgress: 0 },
    ],
    semester_marks: [],
    semester_marksheet: { url: '', uploadProgress: 0 },
    total_max_marks: '',
    total_obtained_marks: '',
    percentage: '',
    cgpa: '',
    overall_grade: '',
    class_obtained: '',
    current_designation: '',
    current_institute: '',
    years_experience: '',
    annual_income: '',
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (!token) {
        toast.error('Please login again.');
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/application/page3/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.data.status === 'success' && res.data.data && mounted) {
          const data = res.data.data || {};
          // Ensure S.S.L.C and HSC are always present
          const defaultQualifications = [
            { course: 'S.S.L.C', institute_name: '', board: '', subject_studied: '', reg_no: '', percentage: '', month_year: '', mode_of_study: '', sslc_marksheet_url: '', uploadProgress: 0 },
            { course: 'HSC', institute_name: '', board: '', subject_studied: '', reg_no: '', percentage: '', month_year: '', mode_of_study: '', hsc_marksheet_url: '', uploadProgress: 0 },
          ];
          const fetchedQualifications = Array.isArray(data.qualifications) ? data.qualifications : [];
          const sslcQual = fetchedQualifications.find(q => q.course === 'S.S.L.C') || defaultQualifications[0];
          const hscQual = fetchedQualifications.find(q => q.course === 'HSC') || defaultQualifications[1];
          const otherQuals = fetchedQualifications.filter(q => !['S.S.L.C', 'HSC'].includes(q.course));
          
          setFormData({
            email: data.email || '',
            name_initial: data.name_initial || '',
            qualifications: [
              { ...sslcQual, ...defaultQualifications[0], ...sslcQual }, // Merge default with fetched data for S.S.L.C
              { ...hscQual, ...defaultQualifications[1], ...hscQual }, // Merge default with fetched data for HSC
              ...otherQuals, // Add any additional qualifications
            ],
            semester_marks: Array.isArray(data.semester_marks) ? data.semester_marks : [],
            semester_marksheet: { url: data.semester_marksheet_url || '', uploadProgress: 0 },
            total_max_marks: data.total_max_marks || '',
            total_obtained_marks: data.total_obtained_marks || '',
            percentage: data.percentage || '',
            cgpa: data.cgpa || '',
            overall_grade: data.overall_grade || '',
            class_obtained: data.class_obtained || '',
            current_designation: data.current_designation || '',
            current_institute: data.current_institute || '',
            years_experience: data.years_experience != null ? data.years_experience.toString() : '',
            annual_income: data.annual_income != null ? data.annual_income.toString() : '',
          });
          localStorage.setItem('userEmail', data.email || '');
        }
      } catch (err) {
        const message = err.response?.data?.message || 'Error fetching data';
        setFetchError(message);
        toast.error('Error fetching data: ' + message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [navigate, token]);

  const validateForm = useCallback(() => {
    const errors = {};
    // Validate qualifications
    formData.qualifications.forEach((qual, idx) => {
      const qualErrors = [];
      ['course', 'institute_name', 'board', 'subject_studied', 'reg_no', 'percentage', 'month_year', 'mode_of_study'].forEach(field => {
        if (!qual[field]?.trim()) {
          qualErrors.push(`${field.replace(/_/g, ' ')} is required`);
        }
      });
      if (qual.percentage && (parseFloat(qual.percentage) < 0 || parseFloat(qual.percentage) > 100)) {
        qualErrors.push(`Percentage must be between 0 and 100`);
      }
      if (qual.month_year && !/^\d{2}\/\d{4}$/.test(qual.month_year)) {
        qualErrors.push(`Month & Year must be in MM/YYYY format`);
      }
      if (qual.course === 'S.S.L.C' && !qual.sslc_marksheet_url?.trim()) {
        qualErrors.push(`SSLC Marksheet is required`);
      }
      if (qual.course === 'HSC' && !qual.hsc_marksheet_url?.trim()) {
        qualErrors.push(`HSC Marksheet is required`);
      }
      if (qualErrors.length > 0) {
        errors[`qualification_${idx}`] = qualErrors;
      }
    });
    if (!formData.qualifications.some(q => q.course === 'S.S.L.C')) {
      errors['qualifications'] = errors['qualifications'] || [];
      errors['qualifications'].push('S.S.L.C (10th) qualification is mandatory');
    }
    if (!formData.qualifications.some(q => q.course === 'HSC')) {
      errors['qualifications'] = errors['qualifications'] || [];
      errors['qualifications'].push('HSC (12th) qualification is mandatory');
    }
    // Validate semester marks
    formData.semester_marks.forEach((semester, idx) => {
      const semErrors = [];
      if (!isOptionalSemester(idx)) {
        if (!semester.semester?.trim()) {
          semErrors.push(`Semester/Year is required`);
        }
        if (!semester.subjects?.length) {
          semErrors.push(`At least one subject is required`);
        } else {
          semester.subjects.forEach((subject, subIdx) => {
            const subErrors = [];
            ['subject_name', 'category', 'max_marks', 'obtained_marks', 'month_year'].forEach(field => {
              if (!subject[field]?.trim()) {
                subErrors.push(`${field.replace(/_/g, ' ')} is required`);
              }
            });
            if (subject.max_marks && parseFloat(subject.max_marks) <= 0) {
              subErrors.push(`Max Marks must be positive`);
            }
            if (subject.obtained_marks && (parseFloat(subject.obtained_marks) < 0 || parseFloat(subject.obtained_marks) > parseFloat(subject.max_marks))) {
              subErrors.push(`Obtained Marks must be between 0 and Max Marks`);
            }
            if (subject.month_year && !/^\d{2}\/\d{4}$/.test(subject.month_year)) {
              subErrors.push(`Month & Year must be in MM/YYYY format`);
            }
            if (subErrors.length > 0) {
              semErrors.push(`Subject ${subIdx + 1}: ${subErrors.join('; ')}`);
            }
          });
        }
        if (semErrors.length > 0) {
          errors[`semester_${idx}`] = semErrors;
        }
      }
    });
    if (formData.semester_marks.length > 0 && !formData.semester_marksheet?.url?.trim()) {
      errors['semester_marksheet'] = ['Semester marksheet upload is required'];
    }
    ['total_max_marks', 'total_obtained_marks', 'percentage', 'class_obtained'].forEach(field => {
      if (formData.semester_marks.length > 0 && !formData[field]?.toString().trim()) {
        errors[field] = [`${field.replace(/_/g, ' ')} is required for semester marks`];
      }
    });
    ['years_experience', 'annual_income'].forEach(field => {
      const value = formData[field]?.trim();
      if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
        errors[field] = [`${field === 'years_experience' ? 'Years of Experience' : 'Annual Income'} must be a valid non-negative number`];
      }
    });
    setFormErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    console.log('Validation:', {
      errors,
      isValid,
      sslc_marksheet_url: formData.qualifications.find(q => q.course === 'S.S.L.C')?.sslc_marksheet_url,
      hsc_marksheet_url: formData.qualifications.find(q => q.course === 'HSC')?.hsc_marksheet_url,
    });
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const isOptionalSemester = useCallback(index => index === 5, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (['years_experience', 'annual_income'].includes(name)) {
      const trimmedValue = value.trim();
      if (trimmedValue === '' || isNaN(parseFloat(trimmedValue)) || parseFloat(trimmedValue) < 0) {
        setFormData(prev => ({ ...prev, [name]: '' }));
        if (trimmedValue !== '') toast.error(`${name === 'years_experience' ? 'Years of Experience' : 'Annual Income'} must be a valid non-negative number`);
        return;
      }
      setFormData(prev => ({ ...prev, [name]: trimmedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (['years_experience', 'annual_income'].includes(name)) {
      const trimmedValue = value.trim();
      if (trimmedValue === '' || isNaN(parseFloat(trimmedValue)) || parseFloat(trimmedValue) < 0) {
        setFormData(prev => ({ ...prev, [name]: '' }));
        if (trimmedValue !== '') toast.error(`${name === 'years_experience' ? 'Years of Experience' : 'Annual Income'} must be a valid non-negative number`);
      } else {
        setFormData(prev => ({ ...prev, [name]: trimmedValue }));
      }
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login again.');
      navigate('/login');
      return;
    }
    if (Object.keys(formErrors).length > 0) {
      toast.error('Please fix all errors before submitting.');
      return;
    }
    // Extract marksheet URLs from qualifications
    const sslcQual = formData.qualifications.find(q => q.course === 'S.S.L.C');
    const hscQual = formData.qualifications.find(q => q.course === 'HSC');
    const ugQuals = formData.qualifications.filter(q => !['S.S.L.C', 'HSC'].includes(q.course));
    const cleanedFormData = {
      ...formData,
      sslc_marksheet_url: sslcQual?.sslc_marksheet_url?.trim() || '',
      hsc_marksheet_url: hscQual?.hsc_marksheet_url?.trim() || '',
      ug_marksheet_url: ugQuals.length > 0 ? ugQuals[0]?.ug_marksheet_url?.trim() || '' : '',
      semester_marksheet_url: formData.semester_marksheet?.url?.trim() || '',
      qualifications: formData.qualifications.map(qual => ({
        ...qual,
        sslc_marksheet_url: undefined, // Remove nested marksheet URLs
        hsc_marksheet_url: undefined,
        ug_marksheet_url: undefined,
      })).filter(qual => {
        return ['course', 'institute_name', 'board', 'subject_studied', 'reg_no', 'percentage', 'month_year', 'mode_of_study'].every(field => qual[field]?.trim());
      }),
      semester_marks: formData.semester_marks.filter((semester, idx) => {
        if (isOptionalSemester(idx)) return semester.semester?.trim();
        return (
          semester.semester?.trim() &&
          Array.isArray(semester.subjects) &&
          semester.subjects.length > 0 &&
          semester.subjects.every(subject => ['subject_name', 'category', 'max_marks', 'obtained_marks', 'month_year'].every(field => subject[field]?.trim()))
        );
      }),
      years_experience: formData.years_experience?.trim() ? parseFloat(formData.years_experience) : null,
      annual_income: formData.annual_income?.trim() ? parseFloat(formData.annual_income) : null,
      total_max_marks: formData.total_max_marks?.trim() ? parseFloat(formData.total_max_marks) : null,
      total_obtained_marks: formData.total_obtained_marks?.trim() ? parseFloat(formData.total_obtained_marks) : null,
      percentage: formData.percentage?.trim() ? parseFloat(formData.percentage) : null,
    };
    console.log('Submitting Payload:', cleanedFormData);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/application/page3/', cleanedFormData, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.status === 200 && response.data.status === 'success') {
        toast.success('Page 3 submitted successfully!');
        setTimeout(() => navigate('/application/page4'), 1000);
      } else {
        toast.error(response.data.message || 'Submission failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data || 'Error submitting form';
      if (typeof errorMessage === 'object') {
        const errorDetails = Object.entries(errorMessage)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join('; ') : value}`)
          .join('; ');
        toast.error(`Submission failed: ${errorDetails}`);
        setFormErrors(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, formErrors, navigate, token]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-red-600">Failed to Load Data</h2>
          <p className="mt-2 text-gray-600">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
        >
          <Toaster position="top-right" />
          <div className="w-full max-w-7xl mx-auto">
            <StepProgressBar currentStep="/application/page3" />
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-purple-200/40">
              <h2 className="text-4xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900 tracking-tight text-center mb-8">
                Application Form - Educational Qualifications
              </h2>
              {loading && (
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"
                  />
                </div>
              )}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/30 to-cyan-50/30 rounded-xl shadow-sm border border-purple-800/50 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <Info className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 tracking-tight">
                    Instructions
                  </h3>
                </div>
                <ul className="list-disc pl-6 space-y-4 text-gray-800 font-medium text-lg font-roboto">
                  <li>
                    <span className="text-blue-600 font-semibold">Mandatory Fields</span>: S.S.L.C (10th) and HSC (12th) qualifications with marksheet uploads are required.
                  </li>
                  <li>
                    <span className="text-blue-600 font-semibold">Additional Qualifications</span>: Add Diploma, UG, etc., using the "Add Qualification" button.
                  </li>
                  <li>
                    <span className="text-blue-600 font-semibold">Semester Marks</span>: For Arts students, add semesters 1–5 (mandatory) and 6 (optional). Upload a single PDF for all semester marksheets.
                  </li>
                  <li>
                    <span className="text-blue-600 font-semibold">Field Formats</span>:
                    <ul className="list-circle pl-6 mt-2">
                      <li>Month/Year: MM/YYYY (e.g., 06/2023)</li>
                      <li>Percentage: 0–100 (e.g., 85.5)</li>
                      <li>Marks: Positive numbers, obtained marks ≤ max marks</li>
                      <li>Years of Experience/Annual Income: Non-negative numbers (e.g., 2.5, 5.0)</li>
                    </ul>
                  </li>
                  <li>
                    <span className="text-blue-600 font-semibold">Validation</span>: Check for red error messages below fields. All errors must be resolved to enable the "Save and Next" button.
                  </li>
                </ul>
              </div>
              <div className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                    <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-6 tracking-tight">
                      Student Information
                    </h3>
                    {[
                      { name: 'email', label: 'Email', type: 'email' },
                      { name: 'name_initial', label: 'Name with Initial', type: 'text' },
                    ].map(({ name, label, type }) => (
                      <div key={name}>
                        <label className="block text-lg font-medium text-gray-800 font-roboto mb-3 tracking-wide">
                          {label} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name] || ''}
                          disabled={true}
                          className="w-full p-4 bg-gray-100/70 backdrop-blur-sm rounded-xl border-2 border-blue-300 shadow-sm outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <QualificationsAndSemesters
                  formData={formData}
                  setFormData={setFormData}
                  loading={loading}
                  isOptionalSemester={isOptionalSemester}
                  errors={formErrors}
                />
                <div className="space-y-8 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
                  <h3 className="text-2xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6 tracking-tight">
                    Professional Details
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                      { name: 'current_designation', label: 'Current Designation', type: 'text' },
                      { name: 'current_institute', label: 'Current Working Institution', type: 'text' },
                      { name: 'years_experience', label: 'Years of Experience', type: 'number', min: 0, step: 0.1 },
                      { name: 'annual_income', label: 'Annual Income (in Lakhs)', type: 'number', min: 0, step: 0.1 },
                    ].map(({ name, label, type, min, step }) => (
                      <div key={name}>
                        <label className="block text-lg font-medium text-gray-800 font-roboto mb-3 tracking-wide">
                          {label} {['years_experience', 'annual_income'].includes(name) ? '' : <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name] || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={loading}
                          min={min}
                          step={step}
                          className={`w-full p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 ${formErrors[name] ? 'border-red-500' : 'border-red-300'} shadow-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-red-400 hover:shadow-red-400/50`}
                        />
                        {formErrors[name] && (
                          <p className="text-red-500 text-sm mt-2 font-roboto">{formErrors[name].join('; ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-8">
                  <motion.button
                    type="button"
                    onClick={() => navigate('/application/page2')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:bg-gray-300 transition duration-300 font-roboto font-bold text-lg shadow-lg"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading || !isFormValid}
                    className={`flex items-center px-8 py-4 bg-gradient-to-r ${isFormValid ? 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' : 'from-purple-300 to-indigo-300 cursor-not-allowed'} text-white rounded-xl disabled:from-purple-300 disabled:to-indigo-300 transition duration-300 font-roboto font-bold text-lg shadow-lg`}
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Save and Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </motion.button>
                </div>
              </div>
              {Object.keys(formErrors).length > 0 && (
                <div className="mt-6 p-6 bg-red-50/70 rounded-xl shadow-sm border border-red-200/50">
                  <div className="text-lg font-semibold text-red-800 font-roboto mb-4">Form Errors</div>
                  <ul className="list-decimal pl-6 space-y-2">
                    {Object.entries(formErrors).map(([key, errors]) => (
                      errors.map((error, idx) => (
                        <li key={`${key}_${idx}`} className="text-red-700 font-roboto text-base">{error}</li>
                      ))
                    ))}
                  </ul>
                </div>
              )}
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
                  className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg"
                >
                  <ArrowUp className="h-6 w-6" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          <style>{`
            .font-montserrat { font-family: 'Montserrat', sans-serif; }
            .font-roboto { font-family: 'Roboto', sans-serif; }
            .font-inter { font-family: 'Inter', sans-serif; }
          `}</style>
        </motion.div>
      </ErrorBoundary>
    </form>
  );
};

export default EducationalQualificationPage;