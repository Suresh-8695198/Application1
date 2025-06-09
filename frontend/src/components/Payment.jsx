import React from 'react';
import { motion } from 'framer-motion';

// Note: Styles (e.g., .font-poppins, .border-gradient) are defined in Dashboard.jsx
const Payment = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
    className="mt-6 bg-gradient-to-br from-white/20 to-indigo-200/20 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border-2 border-gradient text-center w-full max-w-5xl mx-auto"
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
  >
    <h3 className="text-3xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
      Payment Status
    </h3>
    <p className="text-lg font-lato font-normal text-gray-800 leading-relaxed">
      Check the status of your payments for submitted applications.
    </p>
    <p className="text-lg font-lato font-normal text-gray-800 mt-4">No payment records available.</p>
  </motion.div>
);

export default Payment;
