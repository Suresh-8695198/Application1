import React from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const timelineData = [
  {
    year: 2025,
    title: 'Prospectus 2025',
    pdfLink: '/Prospectus-2025.pdf',
    available: false,
  },
  {
    year: 2024,
    title: 'Prospectus 2024',
    pdfLink: '/Prospectus-2024.pdf',
    available: true,
  },
  {
    year: 2023,
    title: 'Prospectus 2023',
    pdfLink: '/Prospectus-2023.pdf',
    available: false,
  },
];

const Prospectus = () => {
  const handleDownload = (pdfLink, available, year) => {
    if (!available) {
      alert(`Prospectus for ${year} is not available yet.`);
      return;
    }
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = `Prospectus-${year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8  sm:py-12 bg-gradient-to-b from-indigo-50/50 to-purple-100/50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-12 w-full max-w-20xl border-4 border-gradient-3d shadow-[0_8px_40px_rgba(79,70,229,0.2)] overflow-hidden"
      >
        {/* Header */}
        <motion.h3
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 sm:mb-8 tracking-tight text-center drop-shadow-md"
        >
          Periyar University Prospectus
        </motion.h3>
        <p className="text-lg sm:text-xl text-center text-gray-700 font-lato mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto">
          Explore our postgraduate programs, admission details, and more in our annual prospectuses.
        </p>

        {/* Timeline */}
        <div className="relative mb-12 sm:mb-16">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-300 to-purple-300 rounded-full hidden md:block"></div>
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center mb-10 sm:mb-14 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} md:items-center`}
            >
              {/* Timeline Content */}
              <div className="w-full md:w-1/2 px-3 sm:px-6">
                <motion.div
                  whileHover={{ y: -10, rotateX: 8, rotateY: index % 2 === 0 ? 6 : -6, boxShadow: '0 15px 40px rgba(79,70,229,0.3)' }}
                  className={`relative p-5 sm:p-7 bg-white/90 backdrop-blur-sm rounded-2xl border-l-4 border-gradient-3d transform perspective-1000 ${index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'}`}
                  style={{
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12), inset 0 2px 3px rgba(255,255,255,0.6)',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,240,240,0.9))',
                  }}
                >
                  <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 font-poppins">{item.title}</h4>
                  <p className="text-base sm:text-lg text-gray-600 font-lato mt-3 leading-relaxed">
                    {item.available
                      ? `Download the ${item.title} to explore programs and admission details for ${item.year}.`
                      : `The ${item.title} is not currently available.`}
                  </p>
                  <motion.button
                    onClick={() => handleDownload(item.pdfLink, item.available, item.year)}
                    whileHover={{ x: index % 2 === 0 ? 6 : -6, backgroundColor: '#4f46e5', color: '#ffffff' }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 sm:mt-5 inline-flex items-center px-4 py-2 bg-white/80 text-indigo-600 font-lato font-medium text-base sm:text-lg rounded-lg border border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    {item.available ? 'Download Now' : 'Unavailable'}
                  </motion.button>
                </motion.div>
              </div>
              {/* Timeline Marker */}
              <motion.div
                onClick={() => handleDownload(item.pdfLink, item.available, item.year)}
                whileHover={{ scale: 1.3, boxShadow: '0 0 20px rgba(79,70,229,0.4)', rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center border-3 border-white shadow-[0_4px_15px_rgba(79,70,229,0.3)] z-10 cursor-pointer my-4 md:my-0"
              >
                <span className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">{item.year}</span>
              </motion.div>
              {/* Empty Spacer for Alignment */}
              <div className="w-full md:w-1/2 px-3 sm:px-6 hidden md:block"></div>
            </motion.div>
          ))}
        </div>

        {/* Main Download Button */}
        <motion.button
          onClick={() => handleDownload('/Prospectus-2024.pdf', true, 2024)}
          whileHover={{ scale: 1.08, boxShadow: '0 10px 40px rgba(79,70,229,0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto font-poppins font-semibold text-xl sm:text-1xl shadow-[0_6px_25px_rgba(79,70,229,0.3)] overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <DocumentArrowDownIcon className="h-5 w-4 sm:h-6 sm:w-6 mr-3 relative z-10" />
          <span className="relative z-10">Download Latest Prospectus (2024)</span>
        </motion.button>
      </motion.div>

      <style jsx>{`
        .font-poppins {
          font-family: 'Poppins', sans-serif !important;
        }
        .font-lato {
          font-family: 'Lato', sans-serif !important;
        }
        .border-gradient-3d {
          border-image: linear-gradient(to bottom, rgba(99, 102, 241, 0.9), rgba(167, 139, 250, 0.9)) 1;
          position: relative;
        }
        .border-gradient-3d::before {
          content: '';
          position: absolute;
          left: -4px;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
          box-shadow: inset 2px 0 6px rgba(0, 0, 0, 0.25);
        }
        .perspective-1000 {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
};

export default Prospectus;