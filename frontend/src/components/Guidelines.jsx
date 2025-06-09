import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon, EnvelopeIcon, PhoneIcon, ClockIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const Guidelines = () => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.02, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' },
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const instructions = [
    'Applications must be completed in all aspects. Incomplete applications are liable to be rejected without any intimation.',
    'Separate application should be submitted for each programme.',
    'Medium of instruction is only in English.',
    'Foreign nationals including NRIs with valid passports and visas issued by the Government of India and refugees will be considered for admission subject to their eligibility in terms of schooling and qualifying examinations passed.',
    'Candidate can select one elective out of 4 options in the application as Specialization in MBA programme.',
    'Self-attested copies of mark statements should be sent along with the filled-in application form (printed after online submission).',
    'Upload your photograph in jpg/png format.',
    'Fee paid will not be refunded if a student leaves the programme after admission.',
    'Fee prescribed is subject to revision by the University. The difference between existing fee and revised fee, if any, should be paid by the candidate at a later date as per the directions of the University.',
    'At the time of admission, the candidate has to pay Institution fee and Tuition fees.',
    'Candidate needs to pay the examination fee separately at the time of examination.',
    'The University is not responsible for any postal delay or loss in transit.',
    'The decision of the University is final on all matters related to admission.',
    'University has all rights to reject or cancel your admission at any point of time if we find any fault/discrepancy in your submitted application.',
  ];

  const certificates = [
    'Community certificate',
    'Transfer certificate',
    'Aadhar card',
    'Mark statements (10th, Higher Secondary, UG)',
    'UG-Degree/Provisional Certificate',
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-6 w-full max-w-5xl sm:max-w-full mx-auto px-4 sm:px-6 py-8"
    >
      <div className="bg-gradient-to-br from-white/10 to-indigo-200/10 backdrop-blur-3xl rounded-3xl p-8 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22%3E%3Cpath fill=%22%23ffffff%22 fill-opacity=%220.1%22 d=%22M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z%22%3E%3C/path%3E%3C/svg%3E')] bg-bottom bg-no-repeat animate-wave-slow" />
        <div className="relative z-10">
          <h3 className="text-5xl sm:text-4xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 sm:mb-4 tracking-tight text-center">
            Application Guidelines
          </h3>
          <p className="text-xl sm:text-lg font-lato font-normal text-gray-700 mb-8 sm:mb-6 leading-relaxed text-center">
            Follow these guidelines to ensure a smooth application process for the 2025-2026 academic year.
          </p>

          {/* Instructions Section */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-4 mb-6 shadow-lg border border-indigo-300/30"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            >
              <h4 className="text-3xl sm:text-2xl font-semibold font-poppins text-indigo-800 flex items-center">
                <DocumentTextIcon className="h-7 w-7 sm:h-6 sm:w-6 mr-2" />
                Instructions to Candidates
              </h4>
              {isInstructionsOpen ? (
                <ChevronUpIcon className="h-7 w-7 sm:h-6 sm:w-6 text-indigo-600" />
              ) : (
                <ChevronDownIcon className="h-7 w-7 sm:h-6 sm:w-6 text-indigo-600" />
              )}
            </div>
            <AnimatePresence>
              {isInstructionsOpen && (
                <motion.ul
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-4 space-y-3 list-none pl-4"
                >
                  {instructions.map((instruction, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-lg sm:text-base font-lato font-normal text-gray-800 leading-relaxed flex items-start"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mr-3 mt-2" />
                      {instruction}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Certificates Section */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-4 mb-6 shadow-lg border border-indigo-300/30"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsCertificatesOpen(!isCertificatesOpen)}
            >
              <h4 className="text-3xl sm:text-2xl font-semibold font-poppins text-indigo-800 flex items-center">
                <PaperClipIcon className="h-7 w-7 sm:h-6 sm:w-6 mr-2" />
                Required Certificates
              </h4>
              {isCertificatesOpen ? (
                <ChevronUpIcon className="h-7 w-7 sm:h-6 sm:w-6 text-indigo-600" />
              ) : (
                <ChevronDownIcon className="h-7 w-7 sm:h-6 sm:w-6 text-indigo-600" />
              )}
            </div>
            <AnimatePresence>
              {isCertificatesOpen && (
                <motion.ul
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="mt-4 space-y-3 list-none pl-4"
                >
                  {certificates.map((certificate, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-lg sm:text-base font-lato font-normal text-gray-800 leading-relaxed flex items-start"
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-purple-600 mr-3 mt-2" />
                      {certificate}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Submission Details */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-4 mb-6 shadow-lg border border-indigo-300/30"
          >
            <h4 className="text-3xl sm:text-2xl font-semibold font-poppins text-indigo-800 mb-4 flex items-center">
              <ClockIcon className="h-7 w-7 sm:h-6 sm:w-6 mr-2" />
              Submission Details
            </h4>
            <p className="text-lg sm:text-base font-lato font-normal text-gray-800 leading-relaxed mb-4">
              After completing the online application, take a hard copy printout of your application and send it along with the required documents to:
            </p>
            <p className="text-lg sm:text-base font-lato font-medium text-gray-900">
              The Director<br />
              Centre for Distance and Online Education (CDOE)<br />
              Periyar University,<br />
              Salem - 636011.
            </p>
            <p className="text-lg sm:text-base font-lato font-normal text-gray-800 mt-4">
              <span className="font-semibold">Last Date to Apply:</span> March 31, 2026<br />
              <span className="font-semibold">Last Date to Submit Hard Copy:</span> April 5, 2026
            </p>
            <p className="text-lg sm:text-base font-lato font-normal text-gray-800 mt-4">
              <span className="font-semibold">Institution Fee:</span> Rs. 1000/-
            </p>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-4 shadow-lg border border-indigo-300/30"
          >
            <h4 className="text-3xl sm:text-2xl font-semibold font-poppins text-indigo-800 mb-4 flex items-center">
              <EnvelopeIcon className="h-7 w-7 sm:h-6 sm:w-6 mr-2" />
              Contact Information
            </h4>
            <p className="text-lg sm:text-base font-lato font-normal text-gray-800 leading-relaxed mb-4">
              For any further clarification or details, please reach out to us:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <motion.a
                href="tel:+914272345918"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300 text-lg sm:text-base"
              >
                <PhoneIcon className="h-6 w-6 sm:h-5 sm:w-5 mr-2" />
                0427-2345918
              </motion.a>
              <motion.a
                href="tel:+914272345258"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300 text-lg sm:text-base"
              >
                <PhoneIcon className="h-6 w-6 sm:h-5 sm:w-5 mr-2" />
                0427-2345258
              </motion.a>
              <motion.a
                href="mailto:pridedirector@periyaruniversity.ac.in"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition duration-300 text-lg sm:text-base"
              >
                <EnvelopeIcon className="h-6 w-6 sm:h-5 sm:w-5 mr-2" />
                pridedirector@periyaruniversity.ac.in
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .font-poppins {
          font-family: 'Poppins', sans-serif !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        }
        .font-lato {
          font-family: 'Lato', sans-serif !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .border-gradient {
          border-image: linear-gradient(to right, rgba(126, 34, 206, 0.7), rgba(167, 139, 250, 0.7)) 1;
        }
        @keyframes waveSlow {
          0% { background-position: 0 bottom; }
          50% { background-position: 1440px bottom; }
          100% { background-position: 2880px bottom; }
        }
        .animate-wave-slow {
          animation: waveSlow 12s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default Guidelines;