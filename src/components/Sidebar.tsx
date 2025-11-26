import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, BarChart3, Table2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNotificationStore } from '../config/store';

interface SidebarProps {
  userName?: string;
  onNavigate?: (page: 'dashboard' | 'tabla') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addNotification('Sesión cerrada correctamente', 'success');
    } catch (error) {
      addNotification('Error al cerrar sesión', 'error');
    }
  };

  const handleNavigate = (page: 'dashboard' | 'tabla') => {
    onNavigate?.(page);
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, action: () => handleNavigate('dashboard') },
    { label: 'Tabla', icon: Table2, action: () => handleNavigate('tabla') },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-secondary" />
        ) : (
          <Menu className="w-6 h-6 text-secondary" />
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={isOpen ? { x: 0 } : { x: -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-secondary to-secondary/90 shadow-2xl z-40 p-6"
      >
        <div className="mt-16 flex flex-col h-full">
          {/* User Info */}
          <div className="mb-8 pb-6 border-b border-white/20">
            <p className="text-white/70 text-sm">Bienvenido</p>
            <p className="text-white font-bold text-lg truncate">{userName || 'Usuario'}</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors group"
                whileHover={{ x: 8 }}
              >
                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};
