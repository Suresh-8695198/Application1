import React from 'react';
import { motion } from 'framer-motion';


// Note: Styles (e.g., .font-poppins, .font-lato) are defined in Dashboard.jsx
const UniversityInfo = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
    className="mb-8 text-center w-full max-w-6xl mx-auto relative"
    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
  >
    <motion.img
      src="./Logo.png"
      alt="Periyar University Logo"
      className="w-36 h-36 mx-auto mb-6 rounded-full shadow-2xl ring-4 ring-indigo-300/50"
      onError={(e) => (e.target.src = 'https://via.placeholder.com/144?text=Logo')}
      whileHover={{ scale: 1.15, boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' }}
      transition={{ type: 'spring', stiffness: 400 }}
    />
    <h2 className="text-5xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
      Periyar University
    </h2>
    <p className="text-lg font-lato font-medium text-gray-700 mb-2">
      Salem-636 011, Tamil Nadu, India
    </p>
    <p className="text-base font-lato font-medium text-gray-600 mb-6">
      NAAC with 'A++' Grade | NIRF Rank 56 | State Public University Rank 25
    </p>
    <div className="max-w-3xl mx-auto">
      <h3 className="text-3xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 tracking-tight">
        Centre for Distance and Online Education - CDOE
      </h3>
      <p className="text-base font-lato font-normal text-gray-600 leading-relaxed">
        Established in 1997, Periyar University, named after social reformer Periyar E.V. Ramasamy, was founded under the Tamil Nadu State Legislature Act (No.45-97). Holding 12(B) and 2(f) status from the UGC, it earned an “A++” Grade from NAAC in 2021 and ranks 59th in NIRF. The Centre for Distance and Online Education (formerly PRIDE), started in 2001, offers Undergraduate, Postgraduate, Diploma, and Certificate programs through Open and Distance Learning (ODL) and online modes since January 2021.
      </p>
    </div>
  </motion.div>
);

export default UniversityInfo;
