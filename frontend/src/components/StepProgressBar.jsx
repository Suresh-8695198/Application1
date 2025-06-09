import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { HomeIcon, UserIcon, AcademicCapIcon, CameraIcon, DocumentTextIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const steps = [
  { name: 'Home', label: 'Start Application', icon: HomeIcon, path: '/application/page1', color: '#8B5CF6' }, // Purple
  { name: 'Profile', label: 'Personal Details', icon: UserIcon, path: '/application/page2', color: '#3B82F6' }, // Blue
  { name: 'Academic', label: 'Qualifications', icon: AcademicCapIcon, path: '/application/page3', color: '#10B981' }, // Green
  { name: 'Photo', label: 'Photo & Signature', icon: CameraIcon, path: '/application/page4', color: '#F59E0B' }, // Yellow
  { name: 'Preview', label: 'Preview', icon: DocumentTextIcon, path: '/application/page5', color: '#EC4899' }, // Pink
  { name: 'Payment', label: 'Payment', icon: CurrencyDollarIcon, path: '/application/page6', color: '#EF4444' }, // Red
  { name: 'Submitted', label: 'Submission', icon: CheckCircleIcon, path: '/application/submitted', color: '#6366F1' }, // Indigo
];

const StepProgressBar = ({ currentStep }) => {
  const currentIndex = steps.findIndex((step) => step.path === currentStep);
  const discreteProgress = currentIndex >= 0 ? Math.round(((currentIndex + 1) / steps.length) * 100) : 0;

  const connectorControls = steps.map(() => useAnimation());

  React.useEffect(() => {
    if (currentIndex === -1) {
      console.warn('Current step not found:', currentStep);
    }
    steps.forEach((_, index) => {
      if (index < currentIndex) {
        connectorControls[index].start({ pathLength: 1, opacity: 1 });
      } else {
        connectorControls[index].start({ pathLength: 0, opacity: 0.3 });
      }
    });
  }, [currentIndex, connectorControls, currentStep]);

  const stepVariants = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
    active: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 border border-gray-300/20 mx-2 sm:mx-4 md:mx-6">
      {/* Progress Percentage */}
      <div className="mb-4 text-center">
        <motion.div
          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-montserrat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {discreteProgress}% Complete
        </motion.div>
        <div className="w-full h-2.5 sm:h-2.5 bg-gray-200 rounded-full mt-2 relative flex">
          {steps.map((step, index) => (
            <motion.div
              key={step.name}
              className="h-full"
              style={{
                width: `${100 / steps.length}%`,
                backgroundColor: index <= currentIndex ? step.color : '#D1D5DB',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index <= currentIndex ? 1 : 0.3 }}
              transition={{ duration: 0.8, type: 'tween', ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
          {/* Glowing Particles for Progress Bar */}
          {currentIndex >= 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  style={{
                    left: `clamp(0%, ${(currentIndex + 1) * (100 / steps.length) - 2 + i}%, ${(currentIndex + 1) * (100 / steps.length)}%)`,
                    top: '50%',
                    width: '6px',
                    height: '6px',
                    backgroundColor: steps[currentIndex].color,
                  }}
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [0.5, 0.9, 0.5],
                    boxShadow: [
                      `0 0 8px ${steps[currentIndex].color}`,
                      `0 0 12px ${steps[currentIndex].color}`,
                      `0 0 8px ${steps[currentIndex].color}`,
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fallback for Invalid Step */}
      {currentIndex === -1 && (
        <div className="text-center text-red-500 font-montserrat">
          Invalid step selected. Please return to the <a href="/application/page1" className="underline">first step</a>.
        </div>
      )}

      {/* Steps */}
      <div className="relative flex flex-row items-center justify-between gap-2 sm:gap-4">
        {steps.map((step, index) => (
          <div key={step.name} className="flex-1 text-center relative z-10">
            <motion.div
              custom={index}
              variants={stepVariants}
              initial="hidden"
              animate={index === currentIndex ? 'active' : 'visible'}
              className="group relative"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 mx-auto backdrop-blur-sm shadow-lg transition-transform duration-300 group-hover:shadow-neon
                  ${index <= currentIndex ? 'bg-opacity-20' : 'bg-gray-100/30'}`}
                style={{
                  borderColor: index <= currentIndex ? step.color : '#D1D5DB',
                  backgroundColor: index === currentIndex ? `${step.color}50` : index < currentIndex ? `${step.color}33` : undefined,
                }}
              >
                <step.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:h-7
                    ${index === currentIndex ? 'text-white-500 scale-110' : index < currentIndex ? '' : 'text-gray-500'}`}
                  style={{ color: index < currentIndex && index !== currentIndex ? step.color : undefined }}
                />
              </div>
              <motion.span
                className={`mt-2 block text-xs sm:text-sm mb-3 md:text-base font-semibold font-montserrat text-shadow-sm
                  ${index === currentIndex ? 'font-extrabold' : index < currentIndex ? '' : 'text-gray-500'}`}
                style={{ color: index <= currentIndex ? step.color : undefined }}
                animate={index === currentIndex ? { scale: 1.15, color: step.color } : {}}
              >
                {step.name}
              </motion.span>
              {/* Tooltip */}
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="hidden"
                whileHover="visible"
                exit="hidden"
                className="absolute top-[-40px] sm:top-[-50px] left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg pointer-events-none"
                style={{ backgroundColor: step.color }}
              >
                {step.label}
              </motion.div>
            </motion.div>

            {/* Animated SVG Connector */}
            {index < steps.length - 1 && (
              <svg
                className="absolute top-5 sm:top-6 md:top-7 left-1/2 w-1/2 h-6 sm:h-8 md:h-10"
                style={{ transform: 'translateX(50%)' }}
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0,10 C30,0 70,20 100,10"
                  stroke={steps[index].color}
                  strokeWidth="2.5"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={connectorControls[index]}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Particle Effects for Active Step */}
      {currentIndex >= 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: `${50 + (currentIndex * (100 / steps.length))}%`,
                top: '30%',
                width: '6px',
                height: '6px',
                backgroundColor: steps[currentIndex].color,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.5, 0.9, 0.5],
                boxShadow: [
                  `0 0 8px ${steps[currentIndex].color}`,
                  `0 0 12px ${steps[currentIndex].color}`,
                  `0 0 8px ${steps[currentIndex].color}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.5), 0 0 16px rgba(99, 102, 241, 0.3);
        }
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .particle {
          position: absolute;
          border-radius: 50%;
        }
        @media (max-width: 640px) {
          .flex-row {
            gap: 0.5rem;
          }
          .w-10 {
            width: 2.25rem;
            height: 2.25rem;
          }
          .h-5 {
            height: 1.25rem;
            width: 1.25rem;
          }
          .text-xs {
            font-size: 0.65rem;
          }
          .mt-2 {
            margin-top: 0.25rem;
          }
          .top-5 {
            top: 1.125rem;
          }
          .h-6 {
            height: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StepProgressBar;