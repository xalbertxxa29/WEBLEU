import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Incidencia } from '../types/incidents';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';

type SortKey = 'createdAt' | 'nombreAgente' | 'punto' | 'observacion';
type SortOrder = 'asc' | 'desc';

export const TablaIncidencias: React.FC = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'IncidenciasEU'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Incidencia[];
        setIncidencias(data);
      } catch (error) {
        console.error('Error fetching incidencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSorted = incidencias
    .filter((inc: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (inc.nombreAgente?.toLowerCase().includes(searchLower)) ||
        (inc.punto?.toLowerCase().includes(searchLower)) ||
        (inc.observacion?.toLowerCase().includes(searchLower))
      );
    })
    .sort((a: any, b: any) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === 'createdAt') {
        aVal = a.createdAt?.seconds || 0;
        bVal = b.createdAt?.seconds || 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const SortHeader = ({ label, sortBy }: { label: string; sortBy: SortKey }) => (
    <button
      onClick={() => handleSort(sortBy)}
      className="flex items-center gap-2 hover:text-primary transition-colors"
    >
      {label}
      {sortKey === sortBy && (
        sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
      )}
    </button>
  );

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-secondary/80 p-6">
          <h2 className="text-3xl font-bold text-white mb-4">📋 Tabla de Incidencias</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Buscar por agente, punto u observación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg pl-10 pr-4 py-2 border border-white/30 focus:outline-none focus:border-white/50 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-secondary">
                  <SortHeader label="📅 Fecha" sortBy="createdAt" />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-secondary">
                  <SortHeader label="👤 Agente" sortBy="nombreAgente" />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-secondary">
                  <SortHeader label="📍 Punto" sortBy="punto" />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-secondary">
                  <SortHeader label="📝 Observación" sortBy="observacion" />
                </th>
                <th className="px-6 py-4 text-left font-semibold text-secondary">
                  📸 Foto
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((inc: any, idx) => (
                  <motion.tr
                    key={inc.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(
                        inc.createdAt?.seconds ? inc.createdAt.seconds * 1000 : inc.createdAt
                      ).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inc.nombreAgente || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {inc.punto || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-xs">
                      <div className="truncate hover:text-clip" title={inc.observacion || '-'}>
                        {inc.observacion || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inc.evidenciaDataUrl ? (
                        <motion.img
                          src={inc.evidenciaDataUrl}
                          alt="Evidencia"
                          className="h-12 w-12 rounded-lg object-cover cursor-pointer border-2 border-primary"
                          onClick={() => setSelectedImage(inc.evidenciaDataUrl)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron incidencias
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{filteredAndSorted.length}</span> de <span className="font-semibold">{incidencias.length}</span> incidencias
          </p>
        </div>
      </motion.div>

      {/* Modal para Imagen Ampliada */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-screen flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={selectedImage}
                alt="Evidencia ampliada"
                className="max-w-full max-h-screen rounded-lg shadow-2xl object-contain"
              />
              <motion.button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} className="text-secondary" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
