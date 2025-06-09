import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeSection, setActiveSection, userData, isProfileOpen, setIsProfileOpen, handleLogout, handleNewApplication, isSidebarOpen, setIsSidebarOpen }) => {
  useEffect(() => {
    console.log('Sidebar.jsx: isSidebarOpen prop:', isSidebarOpen); // Debug
  }, [isSidebarOpen]);

  const sidebarVariants = {
    hidden: { opacity: 0, x: '-100%', scale: 0.95, filter: 'blur(4px)' },
    visible: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 } },
    exit: { opacity: 0, x: '-100%', scale: 0.95, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.1, type: 'spring', stiffness: 120 },
    }),
    hover: {
      scale: 1.03,
      backgroundPosition: 'right center',
      boxShadow: '0 0 15px rgba(167, 139, 250, 0.6), 0 0 25px rgba(255, 255, 255, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    active: { scale: 0.98, transition: { duration: 0.2 } },
  };

  const menuItems = [
    { name: 'dashboard', label: 'Dashboard', icon: HomeIcon, color: 'bg-gradient-to-r from-indigo-600 to-blue-500', hoverColor: 'hover:from-indigo-700 hover:to-blue-600' },
    { name: 'newApplication', label: 'New Application', icon: DocumentTextIcon, color: 'bg-gradient-to-r from-violet-600 to-fuchsia-500', hoverColor: 'hover:from-violet-700 hover:to-fuchsia-600', action: handleNewApplication },
    { name: 'programs', label: 'Programmes', icon: AcademicCapIcon, color: 'bg-gradient-to-r from-purple-600 to-pink-500', hoverColor: 'hover:from-purple-700 hover:to-pink-600' },
    { name: 'guidelines', label: 'Guidelines', icon: DocumentTextIcon, color: 'bg-gradient-to-r from-indigo-500 to-purple-600', hoverColor: 'hover:from-indigo-600 hover:to-purple-700' },
    { name: 'prospectus', label: 'Prospectus', icon: DocumentArrowDownIcon, color: 'bg-gradient-to-r from-fuchsia-500 to-purple-600', hoverColor: 'hover:from-fuchsia-600 hover:to-purple-700' },
    { name: 'applications', label: 'Applications', icon: DocumentTextIcon, color: 'bg-gradient-to-r from-blue-500 to-indigo-600', hoverColor: 'hover:from-blue-600 hover:to-indigo-700' },
    { name: 'payment', label: 'Payment Status', icon: CheckCircleIcon, color: 'bg-gradient-to-r from-purple-600 to-violet-500', hoverColor: 'hover:from-purple-700 hover:to-violet-600' },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          className="fixed sm:static top-0 left-0 w-full max-w-[320px] sm:w-52 lg:w-72 min-h-screen bg-gradient-to-b from-indigo-900 to-purple-600 flex flex-col z-40 overflow-y-auto shadow-2xl backdrop-blur-xl animate-gradient sm:shadow-none sm:z-20"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle particle-sidebar-1"></div>
            <div className="particle particle-sidebar-2"></div>
            <div className="particle particle-sidebar-3"></div>
            <div className="particle particle-sidebar-4"></div>
            <div className="particle particle-sidebar-5"></div>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8 px-3 sm:px-4 pt-20 sm:pt-6 lg:pt-10 relative">
            <motion.img
              src="./Logo.png"
              alt="Periyar University Logo"
              className="w-10 h-10 sm:w-12 lg:w-14 sm:h-12 lg:h-14 rounded-full shadow-lg border-2 border-purple-400/70 ring-4 ring-violet-300/50"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/56?text=Logo')}
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-poppins text-gray-100 tracking-tight relative">
              Periyar University
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-800 to-violet-500"></span>
            </h1>
          </div>

          <nav className="flex-1 space-y-1 sm:space-y-1.5 px-2 sm:px-3 lg:px-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                custom={index}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="active"
                onClick={() => {
                  setActiveSection(item.name);
                  if (item.action) item.action();
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
                }}
                className={`w-full px-3 sm:px-4 py-4 sm:py-2.5 lg:py-3 rounded-lg font-poppins font-semibold text-sm sm:text-base tracking-wide flex items-center text-white ${item.color} ${item.hoverColor} transition-all duration-300 shadow-md hover:animate-glow ${
                  activeSection === item.name ? 'border-l-4 border-white/90 bg-opacity-80' : 'bg-opacity-60'
                }`}
                style={{ backgroundSize: '200% auto' }}
              >
                <item.icon className="h-5 w-5 sm:h-5 lg:w-5 sm:mr-2 lg:mr-3" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <motion.div
            className="mt-auto bg-gradient-to-r from-purple-950/80 to-violet-700/80 rounded-lg p-3 sm:p-4 lg:p-5 mx-2 sm:mx-3 lg:mx-4 mb-2 sm:mb-3 lg:mb-4 shadow-xl border border-purple-400/60 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-8 h-8 sm:w-10 lg:w-12 sm:h-10 lg:h-12 rounded-full bg-gradient-to-br from-purple-800 to-violet-600 flex items-center justify-center shadow-md ring-2 ring-violet-300/70">
                <UserCircleIcon className="w-5 h-5 sm:w-6 lg:w-8 sm:h-6 lg:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-poppins font-semibold text-xs sm:text-sm lg:text-base text-white block truncate">{userData.name}</span>
                <p className="text-[10px] sm:text-xs text-violet-200 font-medium truncate">{userData.email}</p>
              </div>
              {isProfileOpen ? (
                <ChevronUpIcon className="h-3 w-3 sm:h-4 lg:h-5 sm:w-4 lg:w-5 text-violet-200" />
              ) : (
                <ChevronDownIcon className="h-3 w-3 sm:h-4 lg:h-5 sm:w-4 lg:w-5 text-violet-200" />
              )}
            </motion.div>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-2 sm:mt-3 lg:mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleLogout();
                      if (window.innerWidth < 640) setIsSidebarOpen(false);
                    }}
                    className="w-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:from-red-800 hover:to-red-700 transition-all duration-300 font-poppins font-semibold text-xs sm:text-sm lg:text-base flex items-center justify-center shadow-md"
                  >
                    <ArrowLeftOnRectangleIcon className="h-3 w-3 sm:h-4 lg:h-5 sm:w-4 lg:w-5 mr-1 sm:mr-1.5 lg:mr-2" />
                    Sign Out
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;