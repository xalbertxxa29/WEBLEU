import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Incidencia } from '../types/incidents';

interface ChartData {
  name: string;
  value: number;
}

interface DateChartData {
  fecha: string;
  cantidad: number;
}

const COLORS = ['#FF6B35', '#004E89', '#F7B801', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-primary">
        <p className="font-semibold text-secondary">{payload[0].payload.fecha || payload[0].payload.name || payload[0].name}</p>
        <p className="text-primary font-bold text-lg">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const ChartsSection: React.FC = () => {
  const [dateData, setDateData] = useState<DateChartData[]>([]);
  const [agentCounts, setAgentCounts] = useState<ChartData[]>([]);
  const [pointCounts, setPointCounts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'IncidenciasEU'));
        const querySnapshot = await getDocs(q);
        const incidencias = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Incidencia[];

        // Datos por fecha (createdAt)
        const dateMap: Record<string, number> = {};
        incidencias.forEach((inc: any) => {
          if (inc.createdAt) {
            const fecha = new Date(inc.createdAt.seconds ? inc.createdAt.seconds * 1000 : inc.createdAt).toLocaleDateString('es-ES');
            dateMap[fecha] = (dateMap[fecha] || 0) + 1;
          }
        });

        const sortedDateData = Object.entries(dateMap)
          .map(([fecha, cantidad]) => ({ fecha, cantidad }))
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
          .slice(-10);

        setDateData(sortedDateData);

        // Datos por nombreAgente
        const agentMap: Record<string, number> = {};
        incidencias.forEach((inc: any) => {
          if (inc.nombreAgente) {
            agentMap[inc.nombreAgente] = (agentMap[inc.nombreAgente] || 0) + 1;
          }
        });

        const sortedAgentData = Object.entries(agentMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

        setAgentCounts(sortedAgentData);

        // Datos por punto (punto de marcación)
        const pointMap: Record<string, number> = {};
        incidencias.forEach((inc: any) => {
          if (inc.punto) {
            pointMap[inc.punto] = (pointMap[inc.punto] || 0) + 1;
          }
        });

        const sortedPointData = Object.entries(pointMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setPointCounts(sortedPointData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-12 shadow-2xl border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        <p className="text-gray-500 text-center mt-4">Cargando gráficos...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gráfico por Fecha - Moderno */}
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-2xl border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ boxShadow: "0 20px 40px rgba(0, 78, 137, 0.15)" }}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-secondary mb-2">
            📅 Incidencias por Fecha de Creación
          </h2>
          <p className="text-gray-500">Evolución de incidencias en los últimos días</p>
        </div>
        {dateData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dateData}>
              <defs>
                <linearGradient id="colorCantidad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="fecha" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#FF6B35" 
                strokeWidth={4}
                dot={{ fill: '#FF6B35', r: 6 }}
                activeDot={{ r: 8 }}
                name="Cantidad de Incidencias"
                fillOpacity={1}
                fill="url(#colorCantidad)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
        )}
      </motion.div>

      {/* Gráfico por Agente - Moderno */}
      <motion.div
        className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-8 shadow-2xl border border-orange-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ boxShadow: "0 20px 40px rgba(0, 78, 137, 0.15)" }}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-secondary mb-2">
            👥 Incidencias por Agente
          </h2>
          <p className="text-gray-500">Top 8 agentes con más incidencias</p>
        </div>
        {agentCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={agentCounts}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#004E89" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#004E89" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                fill="url(#colorBar)"
                radius={[12, 12, 0, 0]}
                name="Cantidad de Incidencias"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
        )}
      </motion.div>

      {/* Gráfico por Punto de Marcación - Moderno */}
      <motion.div
        className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-8 shadow-2xl border border-yellow-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ boxShadow: "0 20px 40px rgba(0, 78, 137, 0.15)" }}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-secondary mb-2">
            📍 Incidencias por Punto de Marcación
          </h2>
          <p className="text-gray-500">Distribución de incidencias por ubicación</p>
        </div>
        {pointCounts.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pointCounts as any}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pointCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                {pointCounts.map((point, index) => (
                  <motion.div 
                    key={index} 
                    className="p-4 rounded-xl border-l-4 bg-white shadow-md"
                    style={{ borderColor: COLORS[index % COLORS.length] }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-gray-600 text-sm font-semibold truncate">{point.name}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: COLORS[index % COLORS.length] }}>
                      {point.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No hay datos disponibles</p>
        )}
      </motion.div>

      {/* Estadísticas Finales - Moderno */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, staggerChildren: 0.1 }}
      >
        <motion.div 
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-8 text-white shadow-2xl border border-orange-300"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)" }}
        >
          <h3 className="text-white/80 font-semibold mb-3">Fechas Registradas</h3>
          <p className="text-5xl font-bold">{dateData.length}</p>
          <p className="text-white/70 mt-2 text-sm">Días con incidencias</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-2xl border border-blue-400"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 78, 137, 0.3)" }}
        >
          <h3 className="text-white/80 font-semibold mb-3">Agentes Activos</h3>
          <p className="text-5xl font-bold">{agentCounts.length}</p>
          <p className="text-white/70 mt-2 text-sm">Agentes registrados</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-8 text-white shadow-2xl border border-yellow-300"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(247, 184, 1, 0.3)" }}
        >
          <h3 className="text-white/80 font-semibold mb-3">Puntos de Marcación</h3>
          <p className="text-5xl font-bold">{pointCounts.length}</p>
          <p className="text-white/70 mt-2 text-sm">Ubicaciones</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
