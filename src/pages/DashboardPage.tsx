import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/Sidebar';
import { IndicatorsCard } from '../components/IndicatorsCard';
import { ChartsSection } from '../components/ChartsSection';

interface DashboardProps {
  userName?: string;
  onNavigate?: (page: 'dashboard' | 'tabla') => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ userName, onNavigate }) => {
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
              Panel de Control
            </h1>
            <p className="text-gray-600">
              Resumen de incidencias en tiempo real
            </p>
          </div>

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
        </motion.div>
      </main>
    </div>
  );
};
