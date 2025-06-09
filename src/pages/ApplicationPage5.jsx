import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeftIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';
import StepProgressBar from '../components/StepProgressBar';

const PaymentModal = ({ status, amount, onClose }) => {
  const icons = {
    success: <CheckCircleIcon className="w-16 h-16 text-green-500" />,
    failed: <XCircleIcon className="w-16 h-16 text-red-500" />,
    cancelled: <ClockIcon className="w-16 h-16 text-yellow-500" />,
  };
  const messages = {
    success: 'Payment Successful!',
    failed: 'Payment Failed',
    cancelled: 'Payment Cancelled',
  };
  const colors = {
    success: 'bg-green-50 border-green-200',
    failed: 'bg-red-50 border-red-200',
    cancelled: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      {status === 'success' && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <motion.div
        className={`bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 ${colors[status]} backdrop-blur-lg`}
        animate={status === 'failed' ? { x: [0, 10, -10, 0] } : {}}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex flex-col items-center space-y-4">
          {icons[status]}
          <h3 className="text-2xl font-bold text-gray-800">{messages[status]}</h3>
          <p className="text-lg font-semibold text-gray-600">Amount: ₹{amount.toFixed(2)}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 23400, // ₹234 in paise
    currency: 'INR',
    order_id: null,
  });
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [userData, setUserData] = useState(() => {
    const cached = localStorage.getItem('userData');
    return cached ? JSON.parse(cached) : { email: '', phone: '', name: '' };
  });
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const retryCount = useRef(0);

  // Preload Razorpay script
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://checkout.razorpay.com/v1/checkout.js';
    link.as = 'script';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay SDK loaded');
      setScriptLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      setIsLoading(false);
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (userData.email && userData.name) {
        setIsLoading(false);
        return;
      }

      try {
        const userResponse = await axios.get('http://localhost:8000/api/student-details/', {
          headers: { Authorization: `Token ${token}` },
        });
        if (userResponse.data.status === 'success' && userResponse.data.data) {
          const data = {
            email: userResponse.data.data.email || '',
            phone: userResponse.data.data.phone || '',
            name: userResponse.data.data.name || 'User',
          };
          setUserData(data);
          localStorage.setItem('userData', JSON.stringify(data));
          setIsLoading(false);
        } else {
          throw new Error('Failed to fetch user data.');
        }
      } catch (error) {
        console.error('Student details error:', error);
        try {
          const profileResponse = await axios.get('http://localhost:8000/api/user-profile/', {
            headers: { Authorization: `Token ${token}` },
          });
          if (profileResponse.data.status === 'success' && profileResponse.data.data) {
            const data = {
              email: profileResponse.data.data.email || '',
              phone: profileResponse.data.data.phone || '',
              name: profileResponse.data.data.name || profileResponse.data.data.username || 'User',
            };
            setUserData(data);
            localStorage.setItem('userData', JSON.stringify(data));
            setIsLoading(false);
          } else {
            throw new Error('Failed to fetch profile data.');
          }
        } catch (profileError) {
          console.error('Profile error:', profileError);
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate, userData.email, userData.name]);

  // Fetch order details with retries
  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token || !userData.email || !userData.name || !scriptLoaded || paymentDetails.order_id) {
        return;
      }

      try {
        const orderResponse = await axios.post(
          'http://localhost:8000/api/create-order/',
          { amount: paymentDetails.amount, currency: paymentDetails.currency },
          { headers: { Authorization: `Token ${token}` } }
        );
        if (orderResponse.data.status === 'success' && orderResponse.data.order_id) {
          setPaymentDetails(prev => ({ ...prev, order_id: orderResponse.data.order_id }));
          retryCount.current = 0;
          setIsLoading(false);
        } else {
          throw new Error('Failed to create order.');
        }
      } catch (error) {
        console.error('Order error:', error);
        if (retryCount.current < 2) {
          retryCount.current += 1;
          setTimeout(fetchOrder, 1000); // Retry after 1s
        } else {
          setIsLoading(false);
        }
      }
    };
    fetchOrder();
  }, [userData.email, userData.name, scriptLoaded, paymentDetails.order_id, paymentDetails.amount, paymentDetails.currency]);

  // Enable animations when card is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimationsEnabled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePayment = async () => {
    console.log('Handle payment called', { scriptLoaded, order_id: paymentDetails.order_id, userData });

    if (!window.Razorpay || !scriptLoaded || !paymentDetails.order_id || !userData.email || !userData.name) {
      console.error('Payment prerequisites not met');
      return;
    }

    setIsProcessing(true);
    try {
      const options = {
        key: 'rzp_test_phCnHzNiGNxEc9',
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        name: 'Application Portal',
        description: 'Application Fee Payment',
        image: '/Logo.png',
        order_id: paymentDetails.order_id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              'http://localhost:8000/api/verify-payment/',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
            );
            if (verifyResponse.data.status === 'success') {
              localStorage.setItem('application_id', verifyResponse.data.application_id);
              setPaymentStatus('success');
              setShowModal(true);
              setTimeout(() => {
                setShowModal(false);
                navigate('/application/submitted');
              }, 3000);
            } else {
              setPaymentStatus('failed');
              setShowModal(true);
              setTimeout(() => setShowModal(false), 3000);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentStatus('failed');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
          }
          setIsProcessing(false);
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone || '',
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setIsProcessing(false);
            setPaymentStatus('cancelled');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setPaymentStatus('failed');
        setIsProcessing(false);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      });
    } catch (error) {
      console.error('Payment initialization error:', error.message);
      setIsProcessing(false);
      setPaymentStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <style>
        {`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(124, 58, 237, 0.3); }
            50% { box-shadow: 0 0 25px rgba(124, 58, 237, 0.5); }
          }
          .animate-glow { animation: glow 2.5s ease-in-out infinite; }
          .animate-wave {
            background: radial-gradient(circle at 30% 30%, rgba(248, 215, 215, 0.2), transparent 50%),
                        linear-gradient(135deg, #4B0082 0%, #6B21A8 50%, #DB2777 100%);
            background-size: 200% 200%;
            animation: wave 6s ease-in-out infinite;
          }
          .payment-card {
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAADBJREFUeAFjZGBg+M+AAoYgJgyMjo7OAP4zMDAwMTAwsP///z8gYGBgYGD4z4ABAACvMQEBjL9G3gAAAABJRU5ErkJggg==') repeat,
                        linear-gradient(135deg, #4B0082 0%, #6B21A8 50%, #DB2777 100%);
            background-blend-mode: overlay;
            position: relative;
            overflow: hidden;
          }
          .holographic {
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%);
            background-size: 200% 200%;
            animation: wave 8s ease-in-out infinite;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.2;
            pointer-events: none;
          }
          @media (max-width: 640px) {
            .payment-card { padding: 6px; }
            .payment-button, .back-button { padding: 10px 16px; font-size: 0.9rem; }
            .payment-button svg, .back-button svg { height: 18px; width: 18px; }
            .payment-icons img { height: 40px; width: 40px; }
            .amount-text { font-size: 2.5rem; }
            .secure-badge { top: 5px; padding: 6px 12px; font-size: 0.85rem; }
            .secure-badge svg { height: 16px; width: 16px; }
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <StepProgressBar currentStep="/application/page5" />
        {isLoading && (
          <motion.div
            className="text-center text-gray-600 font-medium p-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Loading payment details...
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200/30"
        >
          <h2 className="text-4xl font-extrabold text-indigo-900 mb-6 text-center font-sans tracking-wide">
            Complete Your Application Payment
          </h2>
          <p className="text-gray-600 text-lg text-center mb-8 font-medium">
            Securely pay the application fee of <span className="font-bold text-indigo-700">₹234.00</span> to finalize your submission.
          </p>

          <motion.div
            ref={cardRef}
            className="relative payment-card p-8 rounded-2xl shadow-[0_10px_40px_rgba(75,0,130,0.3)] border border-white/20 overflow-hidden backdrop-blur-lg animate-glow animate-wave"
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="holographic" />
            {animationsEnabled && (
              <>
                <div className="absolute top-4 left-4 w-3 h-3 bg-white/40 rounded-full animate-pulse" />
                <div className="absolute bottom-8 right-8 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              </>
            )}
            <div className="relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="flex-shrink-0 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src="/Logo.png"
                      alt="Logo"
                      className="h-14 w-14 object-contain rounded-full border-2 border-white/40 shadow-lg animate-pulse"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-50" />
                  </motion.div>
                  <div>
                    <motion.span
                      className="text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200 tracking-tight amount-text"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ₹234.00
                    </motion.span>
                    <p className="text-sm text-white/90 mt-1 font-semibold">Application Fee</p>
                  </div>
                </div>
                <motion.div
                  className="flex items-center mb-12 mr-12 space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-5 py-2 rounded-full shadow-lg border border-white/30 backdrop-blur-sm secure-badge"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.104-.896-2-2-2H4c-1.104 0-2 .896-2 2v7c0 1.104.896 2 2 2h6c1.104 0 2-.896 2-2v-7zm0 0v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  </svg>
                  <span className="text-sm font-semibold text-white tracking-tight">Secured by Razorpay</span>
                </motion.div>
              </div>
              <div className="flex items-center justify-center space-x-8 mt-6 payment-icons">
                <motion.img
                  src="https://img.icons8.com/color/48/000000/visa.png"
                  alt="Visa"
                  className="h-12 w-12 object-contain filter drop-shadow-md"
                  whileHover={{ y: -6, rotate: 8, filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://img.icons8.com/color/48/000000/mastercard.png"
                  alt="Mastercard"
                  className="h-12 w-12 object-contain filter drop-shadow-md"
                  whileHover={{ y: -6, rotate: 8, filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="https://img.icons8.com/color/48/000000/amex.png"
                  alt="Amex"
                  className="h-12 w-12 object-contain filter drop-shadow-md"
                  whileHover={{ y: -6, rotate: 8, filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.p
                className="text-center text-white/90 text-sm mt-6 font-semibold tracking-wide"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Your payment is protected with <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">256-bit encryption</span>
              </motion.p>
            </div>
            <motion.div
              className="absolute top-9 right-6 w-12 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md shadow-inner border border-white/40"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-6 left-8 text-white/70 text-sm font-mono tracking-wider"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              XXXX XXXX XXXX XXXX
            </motion.div>
          </motion.div>
          <div className="flex justify-between items-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(75,85,99,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/application/page4')}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg flex items-center space-x-2 transition duration-300 relative overflow-hidden back-button"
              disabled={isProcessing}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(124,58,237,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayment}
              className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg flex items-center space-x-2 transition duration-300 relative overflow-hidden payment-button ${
                isProcessing || !scriptLoaded || !paymentDetails.order_id || !userData.email || !userData.name
                  ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500'
                  : 'hover:from-indigo-700 hover:to-purple-700'
              }`}
              disabled={isProcessing || !scriptLoaded || !paymentDetails.order_id || !userData.email || !userData.name}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5" />
                  <span>Pay Now</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-500" />
            </motion.button>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {showModal && (
          <PaymentModal
            status={paymentStatus}
            amount={paymentDetails.amount / 100}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(PaymentPage);