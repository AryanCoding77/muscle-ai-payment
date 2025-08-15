import React from 'react';
import { motion } from 'framer-motion';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  trialData: {
    analysesUsed: number;
    analysesLimit: number;
    analysesRemaining: number;
    trialEnded: boolean;
  };
  onUpgrade: () => void;
}

const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ 
  isOpen, 
  onClose, 
  trialData,
  onUpgrade
}) => {
  if (!isOpen) return null;

  // Ensure we have valid data with correct limits
  const analysesLimit = trialData.analysesLimit || 2; // Default to 2 if not provided
  const analysesUsed = Math.min(trialData.analysesUsed || 0, analysesLimit); // Cap at limit
  const analysesRemaining = Math.max(0, analysesLimit - analysesUsed);
  const trialEnded = analysesRemaining <= 0;

  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (analysesUsed / analysesLimit) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              {trialEnded ? (
                <>
                  <span className="text-2xl mr-2">🚫</span> Free Trial Ended
                </>
              ) : (
                <>
                  <span className="text-2xl mr-2">🎉</span> Free Trial
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {trialEnded ? (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your free trial has ended. To continue analyzing your photos, please choose a subscription plan.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analysesUsed}/{analysesLimit} analyses used
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have {analysesRemaining} free analysis {analysesRemaining === 1 ? 'credit' : 'credits'} remaining! Use them to see how Muscle AI works.
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analysesUsed}/{analysesLimit} analyses used
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {trialEnded ? 'Maybe Later' : 'Continue'}
            </button>
            {trialEnded && (
              <button
                onClick={onUpgrade}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                Choose a Plan
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FreeTrialModal; 