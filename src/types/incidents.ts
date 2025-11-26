export interface Incidencia {
  id: string;
  tipo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
  fechaResolucion?: string;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  usuario: string;
  referencia?: string;
  meta?: Record<string, any>;
}
