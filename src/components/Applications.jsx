import React from 'react';
import { motion } from 'framer-motion';

// Note: Styles (e.g., .font-lato, .border-gradient) are defined in Dashboard.jsx
const Applications = ({ applications, handleOpenApplication }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
    className="mt-6 bg-gradient-to-br from-white/20 to-indigo-200/20 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border-2 border-gradient text-center w-full max-w-5xl mx-auto"
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
  >
    <h3 className="text-3xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
      Submitted Applications
    </h3>
    <p className="text-lg font-lato font-normal text-gray-800 leading-relaxed">
      View the status of your submitted applications here.
    </p>
    {applications.active.length === 0 ? (
      <p className="text-lg font-lato font-normal text-gray-800 mt-4">No applications submitted yet.</p>
    ) : (
      applications.active.map((app) => (
        <motion.div
          key={app.id}
          className="p-4 bg-white/95 rounded-xl shadow-lg mb-4 border border-indigo-300/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <p className="font-lato font-normal text-base text-gray-800">Application ID: {app.id}</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenApplication(app.id)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl hover:from-indigo-800 hover:to-purple-800 transition duration-300 font-lato font-semibold text-base"
          >
            View Details
          </motion.button>
        </motion.div>
      ))
    )}
  </motion.div>
);

export default Applications;