import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { ChartsSection } from '../components/ChartsSection';

interface DashboardProps {
  userName?: string;
  onNavigate?: (page: 'dashboard' | 'tabla') => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ userName, onNavigate }) => {
  const [activeKPI, setActiveKPI] = useState<'facility' | 'security'>('facility');

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
          {/* KPI Selector */}
          <div className="mb-8 pt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-6">
              Panel de Control
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                onClick={() => setActiveKPI('facility')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeKPI === 'facility'
                    ? 'bg-primary text-white shadow-lg shadow-primary/40'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 KPI FACILITY
              </motion.button>
              
              <motion.button
                onClick={() => setActiveKPI('security')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeKPI === 'security'
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/40'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔐 KPI SECURITY
              </motion.button>
            </div>

            <p className="text-gray-600">
              {activeKPI === 'facility' 
                ? 'Resumen de incidencias en tiempo real' 
                : 'Monitoreo de seguridad'}
            </p>
          </div>

          {/* Content based on active KPI */}
          <motion.div
            key={activeKPI}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeKPI === 'facility' ? (
              <>
                {/* Indicators */}
                <IndicatorsCard />

                {/* Charts Section */}
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ChartsSection />
                </motion.div>
              </>
            ) : (
              <motion.div
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-12 shadow-2xl border border-blue-100 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h2 className="text-3xl font-bold text-secondary mb-4">🔐 KPI SECURITY</h2>
                <p className="text-gray-600 text-lg">
                  Contenido de seguridad próximamente...
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
