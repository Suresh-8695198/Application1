import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InstructionsModal = ({ isOpen, onClose, onConfirm }) => {
  const [isChecked, setIsChecked] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: 'easeOut', type: 'spring', stiffness: 120 } 
    },
    exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto border-4 border-gradient animate-gradient font-roboto"
            role="dialog"
            aria-labelledby="instructions-title"
            aria-modal="true"
          >
            {/* Particle Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2
                id="instructions-title"
                className="text-2xl sm:text-3xl font-bold text-purple-800 font-montserrat tracking-tight text-shadow-sm"
              >
                Instructions to Candidates
              </h2>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full p-1"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </motion.button>
            </div>

            <div className="text-gray-700 text-sm sm:text-base font-roboto space-y-4 pr-2">
              <p><strong>1.</strong> Applications must be completed in all aspects. Incomplete applications are liable to be rejected without any intimation.</p>
              <p><strong>2.</strong> Separate application should be submitted for each programme.</p>
              <p><strong>3.</strong> Medium of instruction is only in English.</p>
              <p><strong>4.</strong> Foreign nationals including NRIs with valid passports and visas issued by the Government of India and refugees will be considered for admission subject to their eligibility in terms of schooling and qualifying examinations passed.</p>
              <p><strong>5.</strong> Candidate can select one elective out of 4 options in the application as Specialization in MBA programme.</p>
              <p><strong>6.</strong> Self-attested copies of mark statements should be sent along with the filled application form (printed after online submission).</p>
              <p><strong>7.</strong> Upload your photograph in jpg/png format.</p>
              <p><strong>8.</strong> Fee paid will not be refunded if a student leaves the programme after admission.</p>
              <p><strong>9.</strong> Fee prescribed is subject to revision by the University. The difference between existing fee and revised fee, if any, should be paid by the candidate at a later date as per the directions of the University.</p>
              <p><strong>10.</strong> At the time of admission, candidate has to pay Institution fee and Tuition fees.</p>
              <p><strong>11.</strong> Candidate needs to pay examination fee separately at the time of examination.</p>
              <p><strong>12.</strong> The University is not responsible for any postal delay or loss in transit.</p>
              <p><strong>13.</strong> The decision of the University is final on all matters related to admission.</p>
              <p><strong>14.</strong> University has all rights to reject or cancel your admission at any point of time, if we found any fault/discrepancy in your submitted application.</p>
              <p><strong>15.</strong> <span className="font-semibold text-purple-700">Last date to Apply:</span> June 30, 2025</p>
              <p><strong>16.</strong> <span className="font-semibold text-purple-700">Last date to submit downloaded online filled application along with application fee to this office:</span> July 5, 2025</p>
              <p><strong>17.</strong> Enclose attested copies of the following certificates along with the filled application:
                <ul className="list-disc pl-5 sm:pl-6 space-y-1">
                  <li>Community certificate</li>
                  <li>Transfer certificate</li>
                  <li>Aadhar card</li>
                  <li>Mark statements (10th, Higher Secondary, UG)</li>
                  <li>UG-Degree/Provisional Certificate</li>
                </ul>
              </p>
              <p><strong>18.</strong> After completing the online application, take a hard copy printout and send it to:</p>
              <p className="pl-5 sm:pl-6">
                The Director<br />
                Centre for Distance and Online Education (CDOE)<br />
                Periyar University,<br />
                Salem - 636011.
              </p>
              <p><strong>19.</strong> <span className="font-semibold text-purple-700">Institution Fee:</span> Rs. 1000/-</p>
              <p><strong>20.</strong> For further clarification/details, contact:<br />
                Phone: 0427 - 2345918, 0427 - 2345258<br />
                Email: <a href="mailto:pridedirector@periyaruniversity.ac.in" className="text-purple-600 hover:underline">pridedirector@periyaruniversity.ac.in</a>
              </p>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <input
                type="checkbox"
                id="instructions-read"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="h-5 w-5 text-purple-600 focus:ring-purple-400 border-gray-300 rounded cursor-pointer"
                aria-checked={isChecked}
              />
              <label
                htmlFor="instructions-read"
                className="text-gray-700 text-sm sm:text-base font-roboto cursor-pointer"
              >
                I have read and understood the instructions
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              disabled={!isChecked}
              className={`mt-6 w-full py-3 rounded-xl font-roboto text-white text-sm sm:text-base font-medium flex items-center justify-center transition duration-300 shadow-lg ${
                isChecked
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              I Have Read
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InstructionsModal;