import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Confetti from 'react-confetti';
import { Toaster, toast } from 'react-hot-toast';
import {
  CheckCircleIcon,
  DocumentArrowDownIcon,
  HomeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import StepProgressBar from '../components/StepProgressBar';

const SubmittedApplication = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    application_id: localStorage.getItem('application_id') || 'APP-XXXXXX',
    transaction_id: localStorage.getItem('transaction_id') || 'TXN-XXXXXX',
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    try {
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
        const { name, email } = JSON.parse(cachedUserData);
        setUserData(prev => ({ ...prev, name: name || 'N/A', email: email || 'N/A' }));
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      toast.error('Failed to load user data.');
    }
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      // Header with gradient
      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('Payment Receipt', 105, 25, { align: 'center' });
      // Logo placeholder
      doc.setFontSize(10);
      doc.text('Your Institution Name', 10, 10);

      // Content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleString()}`, 190, 50, { align: 'right' });

      // Table
      autoTable(doc, {
        startY: 60,
        head: [['Field', 'Details']],
        body: [
          ['Application ID', userData.application_id],
          ['Name', userData.name || 'N/A'],
          ['Email', userData.email || 'N/A'],
          ['Transaction ID', userData.transaction_id],
          ['Amount Paid', '₹234.00'],
          ['Date', new Date().toLocaleString()],
        ],
        styles: {
          fontSize: 10,
          cellPadding: 4,
          textColor: [33, 33, 33],
          lineColor: [209, 213, 219],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [124, 58, 237],
          textColor: [255, 255, 255],
          fontSize: 12,
        },
        alternateRowStyles: {
          fillColor: [245, 243, 255],
        },
        margin: { top: 10, left: 10, right: 10 },
      });

      // Footer
      doc.setFillColor(243, 244, 246);
      doc.rect(0, 270, 210, 27, 'F');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.text('Contact: support@institution.com | www.institution.com', 105, 290, { align: 'center' });

      // Save PDF
      doc.save(`Receipt_${userData.application_id}.pdf`);
      toast.success('Receipt downloaded successfully!', { duration: 3000 });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <Toaster position="top-right" />
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <div className="max-w-6xl mx-auto">
        <StepProgressBar currentStep="/application/submitted" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glassmorphism rounded-3xl p-8 mt-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircleIcon className="h-16 w-16 text-brand-purple mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-purple mb-4 font-poppins">
              Application Submitted!
            </h2>
            <p className="text-gray-600 font-roboto text-lg mb-6">
              Your payment of <span className="font-semibold">₹234</span> has been received. Check your email (
              <span className="text-brand-blue">{userData.email || 'N/A'}</span>) for updates.
            </p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-inner"
          >
            <h3 className="text-xl font-semibold text-brand-blue mb-4 text-center font-poppins">
              Application Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              {[
                { label: 'Application ID', value: userData.application_id },
                { label: 'Name', value: userData.name || 'N/A' },
                { label: 'Email', value: userData.email || 'N/A' },
                { label: 'Transaction ID', value: userData.transaction_id },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <SparklesIcon className="h-5 w-5 text-brand-pink" />
                  <div>
                    <h4 className="font-semibold text-gray-800 font-roboto">{item.label}:</h4>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePDF}
              className="btn-gradient px-6 py-3 flex items-center space-x-2 font-roboto text-lg"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Download Receipt</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(107, 114, 128, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-roboto text-lg flex items-center space-x-2 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
      <style jsx>{`
        .font-poppins {
          font-family: 'Poppins', sans-serif !important;
        }
        .font-roboto {
          font-family: 'Roboto', sans-serif !important;
        }
      `}</style>
    </div>
  );
};

export default SubmittedApplication;