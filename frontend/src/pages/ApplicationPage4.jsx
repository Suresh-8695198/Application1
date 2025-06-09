import React, { useState, useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaImage, FaSignature, FaTrash, FaEye } from 'react-icons/fa';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import PropTypes from 'prop-types';
import StepProgressBar from '../components/StepProgressBar';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
          <div className="p-10 bg-white rounded-2xl shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-red-600 font-poppins">Something Went Wrong</h2>
            <p className="mt-4 text-gray-600 font-inter text-lg">Please try again or refresh the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-red-500 font-inter">Error Details</summary>
                <pre className="mt-2 text-sm text-gray-700">
                  {this.state.error?.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={this.resetError}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-inter text-lg transition duration-300"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-inter text-lg transition duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

const ApplicationPage4 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [files, setFiles] = useState({
    photo: null,
    signature: null,
    community_certificate: null,
    aadhar_card: null,
    transfer_certificate: null,
  });
  const [previews, setPreviews] = useState({
    photo: null,
    signature: null,
    community_certificate: null,
    aadhar_card: null,
    transfer_certificate: null,
  });
  const [uploadStatus, setUploadStatus] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dragActive, setDragActive] = useState({
    photo: false,
    signature: false,
    community_certificate: false,
    aadhar_card: false,
    transfer_certificate: false,
  });
  const [uploading, setUploading] = useState({
    photo: false,
    signature: false,
    community_certificate: false,
    aadhar_card: false,
    transfer_certificate: false,
  });
  const [activeGuideline, setActiveGuideline] = useState('photo');

  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchUserEmail = async () => {
      if (!token) {
        if (mounted) {
          setError('No authentication token found. Please log in again.');
          toast.error('Please login again.');
          navigate('/login');
        }
        return;
      }

      setIsLoadingEmail(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/current-user-email/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (mounted && response.data?.status === 'success') {
          setUserEmail(response.data.data?.email || '');
          localStorage.setItem('userEmail', response.data.data?.email || '');
        } else {
          throw new Error(response.data?.message || 'Failed to fetch user email');
        }
      } catch (err) {
        if (mounted) {
          const message = err.response?.data?.message || 'Error connecting to server.';
          setError(message);
          toast.error(message);
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        }
      } finally {
        if (mounted) setIsLoadingEmail(false);
      }
    };

    fetchUserEmail();
    return () => { mounted = false; };
  }, [navigate, token]);

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = {
      photo: ['image/jpeg', 'image/jpg'],
      signature: ['image/jpeg', 'image/jpg'],
      community_certificate: ['image/jpeg', 'image/jpg', 'application/pdf'],
      aadhar_card: ['image/jpeg', 'image/jpg', 'application/pdf'],
      transfer_certificate: ['image/jpeg', 'image/jpg', 'application/pdf'],
    }[type];

    if (!validTypes.includes(file.type)) {
      setUploadStatus((prev) => ({ ...prev, [type]: 'error' }));
      toast.error(`Invalid file type for ${type.replace('_', ' ')}. Allowed: ${validTypes.join(', ')}`);
      return;
    }

    const maxSize = ['community_certificate', 'transfer_certificate'].includes(type) && file.type === 'application/pdf'
      ? 10 * 1024 * 1024
      : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadStatus((prev) => ({ ...prev, [type]: 'error' }));
      toast.error(`File size for ${type.replace('_', ' ')} exceeds ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));
    const timer = setTimeout(() => {
      setFiles((prev) => ({ ...prev, [type]: file }));
      setUploadStatus((prev) => ({ ...prev, [type]: 'selected' }));

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews((prev) => ({ ...prev, [type]: reader.result }));
          setUploading((prev) => ({ ...prev, [type]: false }));
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews((prev) => ({ ...prev, [type]: null }));
        setUploading((prev) => ({ ...prev, [type]: false }));
      }

      setError('');
      toast.success(`File selected for ${type.replace('_', ' ')}`);
    }, 1500);

    return () => clearTimeout(timer);
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive((prev) => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const syntheticEvent = { target: { files: [file] } };
      handleFileChange(syntheticEvent, type);
    }
  };

  const handleRemoveFile = (type, e) => {
    e.stopPropagation();
    setFiles((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => ({ ...prev, [type]: null }));
 UbiquityStatus((prev) => ({ ...prev, [type]: null }));
    toast.success(`Removed ${type.replace('_', ' ')}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      toast.error('User email not found. Please try logging in again.');
      return;
    }

    if (!Object.values(files).some(file => file !== null)) {
      toast.error('Please upload at least one document.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });
    formData.append('email', userEmail);

    try {
      const response = await axios.post(`${BASE_URL}/api/upload-documents/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.status === 'success') {
        setUploadStatus((prev) => {
          const newStatus = { ...prev };
          Object.keys(files).forEach((key) => {
            if (files[key]) newStatus[key] = 'success';
          });
          return newStatus;
        });
        toast.success('Documents uploaded successfully!');
        setTimeout(() => navigate('/application/page5'), 1000);
      } else {
        throw new Error(response.data?.message || 'Failed to upload documents');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Network error occurred while uploading documents';
      toast.error(errorMessage);
      setError(errorMessage);
      setUploadStatus((prev) => {
        const newStatus = { ...prev };
        Object.keys(files).forEach((key) => {
          if (files[key]) newStatus[key] = 'error';
        });
        return newStatus;
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const guidelines = {
    photo: [
      'Format: JPG/JPEG',
      'Size: Max 5MB',
      'Dimensions: 200x250 pixels (Passport size)',
      'Background: Plain white or light-colored',
      'Recent photograph taken within the last 6 months',
    ],
    signature: [
      'Format: JPG/JPEG',
      'Size: Max 5MB',
      'Dimensions: 150x50 pixels (5x1 cm)',
      'Background: White or transparent',
      'Use black or blue ink for clear visibility',
    ],
    community_certificate: [
      'Format: JPG/JPEG or PDF',
      'Size: Max 10MB',
      'Ensure the document is clear and legible',
      'Include all relevant details and stamps',
    ],
    aadhar_card: [
      'Format: JPG/JPEG or PDF',
      'Size: Max 5MB',
      'Ensure all details are visible',
      'Both front and back (if applicable)',
    ],
    transfer_certificate: [
      'Format: JPG/JPEG or PDF',
      'Size: Max 10MB',
      'Include all institutional stamps and signatures',
      'Ensure clarity of text and details',
    ],
  };

  const renderUploadCard = (type, label, accept, isImageType, dimensions) => {
    const { gradient, border, borderHover, particleColor } = {
      photo: {
        gradient: 'from-indigo-600 to-purple-700',
        border: 'border-indigo-500',
        borderHover: 'border-indigo-300',
        particleColor: 'rgba(99, 102, 241, 0.9)', // Indigo-500
      },
      signature: {
        gradient: 'from-purple-600 to-pink-600',
        border: 'border-purple-500',
        borderHover: 'border-purple-300',
        particleColor: 'rgba(168, 85, 247, 0.9)', // Purple-500
      },
      community_certificate: {
        gradient: 'from-blue-600 to-cyan-600',
        border: 'border-blue-500',
        borderHover: 'border-blue-300',
        particleColor: 'rgba(59, 130, 246, 0.9)', // Blue-500
      },
      aadhar_card: {
        gradient: 'from-green-600 to-teal-600',
        border: 'border-green-500',
        borderHover: 'border-green-300',
        particleColor: 'rgba(34, 197, 94, 0.9)', // Green-500
      },
      transfer_certificate: {
        gradient: 'from-orange-600 to-red-600',
        border: 'border-orange-500',
        borderHover: 'border-orange-300',
        particleColor: 'rgba(249, 115, 22, 0.9)', // Orange-500
      },
    }[type];

    const containerVariants = {
      hidden: { opacity: 0, scale: 0.9, y: 30 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -30 },
    };

    return (
      <motion.div
        onMouseEnter={() => setActiveGuideline(type)}
        className="relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          whileHover={{ y: -4, borderColor: borderHover, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}
          className={`relative bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border-2 ${border} transition-all duration-300 ${dragActive[type] ? 'bg-blue-100/50 border-blue-600' : ''} ${uploading[type] ? 'animate-pulse' : ''} ${files[type] ? 'particle-card' : ''}`}
          style={{ width: dimensions?.width || 260, height: dimensions?.height || 195, '--particle-color': particleColor }}
        >
          {uploading[type] && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <div className="rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600" />
            </motion.div>
          )}
          {previews[type] && isImageType ? (
            <div className="relative w-full h-full">
              <img
                src={previews[type]}
                alt={`${type} preview`}
                className="w-full h-full object-cover rounded-xl"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleRemoveFile(type, e)}
                className="absolute top-3 right-3 p-2.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 z-10"
                title="Remove File"
              >
                <FaTrash className="h-4 w-4" />
              </motion.button>
              {uploadStatus[type] === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-3 left-3"
                >
                  <FaCheckCircle className="text-green-500 text-2xl" />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              {isImageType ? (
                type === 'photo' ? <FaImage className="text-blue-600 text-4xl mb-3" /> :
                <FaSignature className="text-blue-600 text-4xl mb-3" />
              ) : (
                <FaUpload className="text-blue-600 text-4xl mb-3" />
              )}
              <p className="text-gray-800 font-inter text-sm font-semibold text-center">{label}</p>
              <p className="text-gray-500 text-xs mt-2 text-center">
                {accept.includes('pdf') ? 'JPG, JPEG, PDF (max 10MB)' : 'JPG, JPEG (max 5MB)'}
              </p>
            </div>
          )}
          <div className="absolute inset-0 z-0">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileChange(e, type)}
              className="w-full h-full opacity-0 cursor-pointer"
              disabled={isSubmitting || isLoadingEmail || uploading[type]}
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
              aria-label={`Upload ${label}`}
            />
          </div>
        </motion.div>
        {!isImageType && files[type] && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-between px-3"
          >
            <p className="text-sm text-gray-600 font-inter truncate max-w-[180px]">
              {files[type]?.name || 'No file name'}
            </p>
            <div className="flex items-center gap-2">
              {previews[type] && (
                <motion.button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); window.open(previews[type], '_blank'); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-inter"
                  title="Preview File"
                >
                  <FaEye className="h-4 w-4 mr-1" />
                  Preview
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleRemoveFile(type, e)}
                className="p-2.5 bg-red-600 text-white rounded-full"
                title="Remove File"
              >
                <FaTrash className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderGuidelines = () => {
    const guidelineVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[360px] h-[450px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 border-2 border-dashed border-purple-300"
      >
        <h3 className="text-2xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          Guidelines:
        </h3>
        <h3 className="text-xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          {activeGuideline.replace('_', ' ').toUpperCase()}
        </h3>
        <div className="h-[380px] overflow-y-auto scrollbar-thin pr-3">
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeGuideline}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={guidelineVariants}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {guidelines[activeGuideline]?.map((guideline, index) => (
                <motion.li
                  key={index}
                  className="flex items-start text-gray-800 font-inter text-sm bg-purple-50/50 rounded-lg p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <FaCheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold text-purple-600">{guideline.split(':')[0]}:</span>
                    {guideline.split(':').slice(1).join(':')}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="p-10 bg-white rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-semibold text-red-600 font-poppins">Failed to Load Data</h2>
          <p className="mt-4 text-gray-600 font-inter text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-inter text-lg transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="particle-bg"></div>
        </div>
        <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto">
          <StepProgressBar currentStep="/application/page4" />
          <motion.div
            className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-dashed border-blue-300 overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900 text-center mb-6">
              Document Upload
            </h2>
            <p className="text-gray-800 font-inter text-center mb-8 text-lg">
              Upload your documents with the specified formats for a smooth application process.
            </p>
            {isLoadingEmail ? (
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
                  <div className="order-1 lg:order-none">{renderGuidelines()}</div>
                  <div className="order-2 flex flex-col gap-8">
                    <div className="flex justify-end">
                      {renderUploadCard('photo', 'Passport Photo', '.jpg,.jpeg', true, { width: 240, height: 300 })}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      {renderUploadCard('community_certificate', 'Community Certificate', '.jpg,.jpeg,.pdf', false)}
                      {renderUploadCard('aadhar_card', 'Aadhar Card', '.jpg,.jpeg,.pdf', false)}
                      {renderUploadCard('transfer_certificate', 'Transfer Certificate', '.jpg,.jpeg,.pdf', false)}
                    </div>
                    <div className="flex justify-center">
                      {renderUploadCard('signature', 'Signature', '.jpg,.jpeg', true, { width: 180, height: 60 })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => navigate('/application/page3')}
                    className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-inter text-lg font-semibold shadow-lg"
                    disabled={isSubmitting || isLoadingEmail}
                    title="Go to Previous Page"
                  >
                    <span className="flex items-center">
                      <ArrowLeft className="h-6 w-6 mr-2" />
                      Back
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-inter text-lg font-semibold shadow-lg ${isSubmitting || isLoadingEmail ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-indigo-700'}`}
                    disabled={isSubmitting || isLoadingEmail}
                    title="Submit Documents and Proceed"
                  >
                    <span className="flex items-center">
                      <ArrowRight className="h-6 w-6 mr-2" />
                      {isSubmitting ? 'Uploading...' : 'Submit & Next'}
                    </span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
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
                type="button"
                onClick={scrollToTop}
                whileHover={{ scale: 1.2, boxShadow: '0 0 15px rgba(139, 92, 246, 0.7)' }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg"
                title="Scroll to Top"
              >
                <ArrowUp className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
            .font-inter { font-family: 'Inter', sans-serif; }
            .font-poppins { font-family: 'Poppins', sans-serif; }
            input[type="file"]::-webkit-file-upload-button { display: none; }
            input[type="file"] { cursor: pointer; }
            [title]:hover:after {
              content: attr(title);
              position: absolute;
              background: rgba(0, 0, 0, 0.85);
              color: white;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 14px;
              z-index: 10;
              margin-top: 10px;
            }
            button:hover { border: none !important; }
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(139, 92, 246, 0.7);
              border-radius: 3px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: rgba(0, 0, 0, 0.05);
            }
            .particle-bg {
              position: absolute;
              inset: 0;
              background: transparent;
              overflow: hidden;
            }
            .particle-bg::before {
              content: '';
              position: absolute;
              width: 3px;
              height: 3px;
              background: rgba(139, 92, 246, 0.4);
              border-radius: 50%;
              animation: particle-float 20s infinite linear;
              top: 15%;
              left: 25%;
            }
            .particle-bg::after {
              content: '';
              position: absolute;
              width: 4px;
              height: 4px;
              background: rgba(99, 102, 241, 0.4);
              border-radius: 50%;
              animation: particle-float 25s infinite linear;
              top: 65%;
              left: 85%;
            }
            @keyframes particle-float {
              0% { transform: translate(0, 0); opacity: 0.6; }
              50% { opacity: 0.9; }
              100% { transform: translate(-120px, -120px); opacity: 0; }
            }
            .particle-card {
              position: relative;
              overflow: hidden;
              animation: glow-pulse 1.8s ease-in-out infinite;
            }
            .particle-card::before,
            .particle-card::after,
            .particle-card > .particle-1,
            .particle-card > .particle-2,
            .particle-card > .particle-3,
            .particle-card > .particle-4,
            .particle-card > .particle-5,
            .particle-card > .particle-6,
            .particle-card > .particle-7,
            .particle-card > .particle-8 {
              content: '';
              position: absolute;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: var(--particle-color);
              box-shadow: 0 0 6px 2px var(--particle-color), 0 0 10px 4px var(--particle-color);
              z-index: 2;
            }
            .particle-card::before {
              top: 10%;
              left: 10%;
              animation: particle-orbit 2.5s ease-in-out infinite;
            }
            .particle-card::after {
              top: 90%;
              left: 90%;
              animation: particle-orbit 2.7s ease-in-out infinite 0.2s;
            }
            .particle-card > .particle-1 {
              top: 20%;
              left: 50%;
              animation: particle-sparkle 2s ease-out infinite 0.4s;
            }
            .particle-card > .particle-2 {
              top: 50%;
              left: 20%;
              animation: particle-sparkle 2.2s ease-out infinite 0.6s;
            }
            .particle-card > .particle-3 {
              top: 80%;
              left: 80%;
              animation: particle-orbit 2.4s ease-in-out infinite 0.3s;
            }
            .particle-card > .particle-4 {
              top: 30%;
              left: 70%;
              animation: particle-sparkle 2.3s ease-out infinite 0.5s;
            }
            .particle-card > .particle-5 {
              top: 70%;
              left: 30%;
              animation: particle-orbit 2.6s ease-in-out infinite 0.7s;
            }
            .particle-card > .particle-6 {
              top: 40%;
              left: 10%;
              animation: particle-sparkle 2.1s ease-out infinite 0.8s;
            }
            .particle-card > .particle-7 {
              top: 60%;
              left: 60%;
              animation: particle-orbit 2.8s ease-in-out infinite 0.1s;
            }
            .particle-card > .particle-8 {
              top: 10%;
              left: 40%;
              animation: particle-sparkle 2.5s ease-out infinite 0.9s;
            }
            @keyframes particle-orbit {
              0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
              50% { transform: translate(10px, -10px) scale(1.3); opacity: 1; }
              100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            }
            @keyframes particle-sparkle {
              0% { transform: translate(0, 0) scale(1); opacity: 1; }
              100% { transform: translate(-20px, 15px) scale(0.3); opacity: 0; }
            }
            @keyframes glow-pulse {
              0% { box-shadow: 0 0 6px rgba(139, 92, 246, 0.4); }
              50% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.7); }
              100% { box-shadow: 0 0 6px rgba(139, 92, 246, 0.4); }
            }
            @media (max-width: 1024px) {
              .lg\\:grid-cols-\\[_360px_1fr_\\] {
                grid-template-columns: 1fr;
              }
              .max-w-7xl {
                max-width: 95%;
              }
              .text-4xl {
                font-size: 2.25rem;
              }
              .text-lg {
                font-size: 1rem;
              }
            }
            @media (max-width: 640px) {
              .max-w-7xl {
                max-width: 100%;
                padding-left: 1rem;
                padding-right: 1rem;
              }
              .max-w-\\[360px\\] {
                max-width: 100%;
              }
              .text-4xl {
                font-size: 2rem;
              }
              .text-lg {
                font-size: 1rem;
              }
              .text-sm {
                font-size: 0.875rem;
              }
              .p-8 {
                padding: 1.5rem;
              }
              .gap-8 {
                gap: 1.5rem;
              }
            }
          `}
        </style>
      </motion.div>
    </ErrorBoundary>
  );
};

export default ApplicationPage4;