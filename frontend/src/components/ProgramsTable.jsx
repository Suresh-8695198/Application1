import React from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaLaptopCode, FaCertificate } from 'react-icons/fa';

// Dynamic icon component based on category and program name
const ProgramIcon = ({ category, programName }) => {
  const getIcon = () => {
    if (category === 'Undergraduate') {
      if (programName.includes('Engineering')) return <FaLaptopCode className="w-8 h-8 text-purple-500" />;
      if (programName.includes('Science')) return <FaBook className="w-8 h-8 text-purple-500" />;
      return <FaGraduationCap className="w-8 h-8 text-purple-500" />;
    } else {
      if (programName.includes('Management')) return <FaCertificate className="w-8 h-8 text-purple-400" />;
      return <FaBook className="w-8 h-8 text-purple-400" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-purple-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300 blur-lg"></div>
      <div className="absolute -inset-1 animate-sparkle" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)' }}></div>
      {getIcon()}
    </div>
  );
};

const ProgramsTable = ({ programs = [] }) => {
  // Separate programs into undergraduate and postgraduate
  const undergraduatePrograms = programs.filter(p => p.category === 'Undergraduate') || [];
  const postgraduatePrograms = programs.filter(p => p.category === 'Postgraduate') || [];

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Animation variants for program cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: 'spring', stiffness: 120 },
    }),
  };

  // Animation variants for text
  const textVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const renderProgramSection = (title, programList, pattern) => (
    <motion.div
      className="mb-20 bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-[0_15px_50px_rgba(0,0,0,0.1)] border border-purple-100/50 max-w-6xl mx-auto transition-all duration-500 hover:shadow-[0_25px_70px_rgba(108,0,255,0.15)] relative overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      role="region"
      aria-label={title}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/10 via-purple-100/10 to-purple-200/10 animate-gradient-bg" />
      <motion.h3
        className="text-5xl sm:text-4xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 sm:mb-4 tracking-tight text-center"
        variants={textVariants}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-center text-gray-500 font-['Inter'] text-lg font-semibold uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-purple-600 mb-12 tracking-widest"
        variants={textVariants}
      >
        {pattern}
      </motion.p>
      {programList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programList.map((program, index) => (
            <motion.div
              key={`${program.category}-${program.name}-${index}`}
              className="group relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 border-2 border-transparent bg-clip-padding shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(108,0,255,0.2)] overflow-hidden transition-all duration-300"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ scale: 1.03, y: -8, boxShadow: '0 20px 50px rgba(108, 0, 255, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              role="article"
              aria-label={`${program.name}${program.duration ? ` - ${program.duration}` : ''}`}
            >
              {/* Gradient border with animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-800 bg-[length:400%_400%] animate-gradient-border rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)' }} />
              <div className="absolute inset-[2px] bg-white/90 rounded-2xl" />
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Subtle sparkle effect */}
              <div className="absolute inset-0 animate-sparkle pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)' }} />
              <div className="relative flex items-center gap-4 mb-6">
                <ProgramIcon category={program.category} programName={program.name} />
                <h4 className="text-xl font-bold font-['Inter'] text-gray-900 tracking-tight">{program.name}</h4>
              </div>
              {program.duration && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-purple-100/80 to-purple-200/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm font-['Inter'] font-semibold text-purple-800 tracking-tight">
                    {program.duration}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          className="text-center text-gray-500 font-['Inter'] text-lg py-10"
          variants={textVariants}
        >
          No programs available for this category.
        </motion.p>
      )}
    </motion.div>
  );

  return (
    <div className="py-16 px-6 sm:px-10 lg:px-16 bg-gray-100/50 relative min-h-screen">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-5 animate-subtle-bg" />
      {undergraduatePrograms.length > 0 || postgraduatePrograms.length > 0 ? (
        <>
          {undergraduatePrograms.length > 0 && renderProgramSection('Undergraduate Programmes', undergraduatePrograms, 'Semester Pattern')}
          {postgraduatePrograms.length > 0 && renderProgramSection('Postgraduate Programmes', postgraduatePrograms, 'Semester Pattern')}
        </>
      ) : (
        <motion.div
          className="text-center bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-[0_15px_50px_rgba(0,0,0,0.1)] border-2 border-transparent bg-clip-padding transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          role="alert"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-300 to-purple-600 bg-[length:400%_400%] animate-gradient-border rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)' }} />
          <div className="absolute inset-[2px] bg-white/95 rounded-3xl" />
          <p className="relative text-gray-500 font-['Inter'] text-lg">No programs available at this time.</p>
        </motion.div>
      )}
      
      <style jsx>{`
        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes subtle-bg {
          0% { background-position: 0 0; }
          100% { background-position: 100px 100px; }
        }
        @keyframes gradient-border {
          0% { background-position: 0% 0%; }
          100% { background-position: 400% 0%; }
        }
        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0.5) translate(0, 0); }
          50% { opacity: 0.3; transform: scale(1) translate(10px, 10px); }
          100% { opacity: 0; transform: scale(0.5) translate(20px, 20px); }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-bg 15s ease infinite;
        }
        .animate-subtle-bg {
          animation: subtle-bg 30s linear infinite;
        }
        .animate-gradient-border {
          animation: gradient-border 4s linear infinite;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProgramsTable;