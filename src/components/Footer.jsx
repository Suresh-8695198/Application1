import React from 'react';
import { motion } from 'framer-motion';

// Note: Styles (e.g., .font-lato, .border-blue-400) are defined in Dashboard.jsx
const Footer = () => (
  <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-6 border-t border-blue-400/30">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="font-lato text-blue-100 text-base font-medium">
        © 2025 Periyar University Centre for Distance and Online Education. All rights reserved.
      </p>
      <div className="mt-2 space-x-4">
        <motion.a
          href="#"
          whileHover={{ scale: 1.1 }}
          className="text-blue-200 font-lato text-sm font-medium hover:text-white transition duration-300"
        >
          Privacy Policy
        </motion.a>
        <motion.a
          href="#"
          whileHover={{ scale: 1.1 }}
          className="text-blue-200 font-lato text-sm font-medium hover:text-white transition duration-300"
        >
          Terms of Service
        </motion.a>
        <motion.a
          href="#"
          whileHover={{ scale: 1.1 }}
          className="text-blue-200 font-lato text-sm font-medium hover:text-white transition duration-300"
        >
          Contact Us
        </motion.a>
      </div>
    </div>
  </footer>
);

export default Footer;
