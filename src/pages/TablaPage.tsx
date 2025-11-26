import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { TablaIncidencias } from '../components/TablaIncidencias';

interface TablaPageProps {
  userName?: string;
  onNavigate?: (page: 'dashboard' | 'tabla') => void;
}

export const TablaPage: React.FC<TablaPageProps> = ({ userName, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light">
      {/* Sidebar */}
      <Sidebar userName={userName} onNavigate={onNavigate} />

      {/* Main Content */}
      <main className="ml-0 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-8 pt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-2">
              Tabla de Incidencias
            </h1>
            <p className="text-gray-600">
              Consulta y filtra todas las incidencias registradas
            </p>
          </div>

          <TablaIncidencias />
        </motion.div>
      </main>
    </div>
  );
};
