import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline';


// Note: Styles (e.g., .font-poppins, .animate-wave-slow) are defined in Dashboard.jsx
const WelcomeSection = ({ deadline, handleNewApplication }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
    className="relative bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl text-white shadow-2xl p-8 mb-6 overflow-hidden  w-full max-w-5xl mx-auto"
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
  >
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 fill-opacity=%220.1%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-bottom bg-no-repeat animate-wave-slow" />
    <div className="relative z-10 text-center">
      <h2 className="text-3xl font-bold font-poppins text-white mb-4 tracking-tight">
        Welcome to Online Education
      </h2>
      <p className="text-lg font-lato font-normal text-indigo-100 mb-4">
        Apply for the 2025-2026 Academic Year
      </p>
      <p className="text-base font-lato font-semibold text-blue-200 flex items-center justify-center mt-3">
        <ClockIcon className="h-5 w-5 mr-2" />
        Deadline: {deadline}
      </p>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 255, 255, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNewApplication}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-white to-indigo-200 text-indigo-900 rounded-xl hover:bg-indigo-300 transition duration-300 flex items-center justify-center mx-auto font-lato font-semibold text-base shadow-lg border border-white/20"
      >
        <SparklesIcon className="h-5 w-5 mr-2" />
        Start New Application
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </motion.button>
    </div>
  </motion.section>

);

export default WelcomeSection;
