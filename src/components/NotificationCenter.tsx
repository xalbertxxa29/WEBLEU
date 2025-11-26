import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../config/store';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 p-4">
      <AnimatePresence>
        <div className="flex flex-col gap-3 pointer-events-auto max-w-md w-full">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg ${getStyle(
                notification.type
              )}`}
            >
              {getIcon(notification.type)}
              <span className="text-sm font-medium text-gray-800 flex-1">
                {notification.message}
              </span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
