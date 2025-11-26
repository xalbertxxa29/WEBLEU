import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Incidencia } from '../types/incidents';
import { useNotificationStore } from '../config/store';

export const IndicatorsCard: React.FC = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const q = query(collection(db, 'IncidenciasEU'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Incidencia[];
        setIncidencias(data);
        addNotification(`${data.length} incidencias cargadas`, 'success');
      } catch (error) {
        console.error('Error fetching incidents:', error);
        addNotification('Error al cargar incidencias', 'error');
      }
    };

    fetchIncidencias();
  }, [addNotification]);

  const stats = {
    total: incidencias.length,
    criticas: incidencias.filter((i) => i.prioridad === 'CRITICA').length,
    activas: incidencias.filter((i) => i.estado !== 'RESUELTO').length,
    resueltas: incidencias.filter((i) => i.estado === 'RESUELTO').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 15 },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Incidents */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-blue-600 font-semibold text-sm">Total de Incidencias</p>
          <motion.div
            className="p-3 bg-blue-200 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </motion.div>
        </div>
        <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
        <p className="text-blue-600 text-xs mt-2">Registro completo</p>
      </motion.div>

      {/* Critical */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-red-600 font-semibold text-sm">Críticas</p>
          <motion.div
            className="p-3 bg-red-200 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
          </motion.div>
        </div>
        <p className="text-4xl font-bold text-red-900">{stats.criticas}</p>
        <p className="text-red-600 text-xs mt-2">Requieren atención</p>
      </motion.div>

      {/* Active */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-yellow-600 font-semibold text-sm">Activas</p>
          <motion.div
            className="p-3 bg-yellow-200 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Clock className="w-6 h-6 text-yellow-600" />
          </motion.div>
        </div>
        <p className="text-4xl font-bold text-yellow-900">{stats.activas}</p>
        <p className="text-yellow-600 text-xs mt-2">En progreso</p>
      </motion.div>

      {/* Resolved */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
        whileHover={{ y: -5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-green-600 font-semibold text-sm">Resueltas</p>
          <motion.div
            className="p-3 bg-green-200 rounded-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
          </motion.div>
        </div>
        <p className="text-4xl font-bold text-green-900">{stats.resueltas}</p>
        <p className="text-green-600 text-xs mt-2">Completadas</p>
      </motion.div>
    </motion.div>
  );
};
