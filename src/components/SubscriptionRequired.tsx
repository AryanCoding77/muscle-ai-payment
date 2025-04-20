import React from 'react';
import Link from 'next/link';

interface SubscriptionRequiredProps {
  onClose?: () => void;
}

const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4 text-red-500 flex items-center justify-center">
            <span className="font-bold text-xl">🔒</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Subscription Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need an active subscription to analyze muscle images. Subscribe to one of our premium plans to unlock this feature.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg w-full mb-6">
            <h3 className="font-semibold mb-3 dark:text-white">What you'll get:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="dark:text-gray-300">Detailed muscle analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="dark:text-gray-300">Personalized improvement recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="dark:text-gray-300">Access to premium AI features</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link 
              href="/pricing" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full"
            >
              <span>💳</span>
              View Plans
            </Link>
            
            {onClose && (
              <button 
                onClick={onClose}
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors w-full"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRequired; 