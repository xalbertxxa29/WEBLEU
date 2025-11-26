# Copilot Instructions for WEBLEU

## Project Overview

**WEBLEU** es un dashboard moderno de indicadores con autenticación Firebase. La aplicación permite a los usuarios iniciar sesión y ver indicadores en tiempo real desde la colección `IncidenciasEU` de Firestore con una interfaz modernísima con efectos tipo Figma.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (transiciones tipo Figma)
- **State Management**: Zustand
- **Backend**: Firebase Auth + Firestore
- **Icons**: Lucide React

## Getting Started

### Installation
```bash
npm install
npm run dev
```

### Firebase Setup
1. Copia `.env.example` a `.env.local`
2. Completa tus credenciales de Firebase:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_PROJECT_ID=...
   # etc
   ```
3. La config se carga automáticamente en `src/config/firebase.ts`

## Project Structure

```
src/
├── components/          # Componentes reutilizables
│   ├── NotificationCenter.tsx   # Notificaciones centradas (animadas)
│   ├── Sidebar.tsx              # Menú hamburguesa moderno
│   └── IndicatorsCard.tsx       # Tarjetas de estadísticas
├── pages/               # Páginas principales
│   ├── LoginPage.tsx            # Autenticación Firebase
│   └── DashboardPage.tsx        # Panel principal
├── config/              # Configuración
│   ├── firebase.ts              # Inicialización Firebase
│   └── store.ts                 # Stores Zustand (Auth + Notifications)
├── types/               # TypeScript interfaces
│   └── incidents.ts             # Interface `Incidencia`
├── assets/              # Recursos estáticos
│   └── logo_liberman.png        # Logo de la empresa
├── App.tsx              # Enrutamiento principal
└── main.tsx             # Punto de entrada
```

## Key Architecture Patterns

### Authentication Flow
- `App.tsx` monitorea cambios en `auth.onAuthStateChanged()`
- Si hay usuario → renderiza `DashboardPage`
- Si no → renderiza `LoginPage`
- El estado se sincroniza en `useAuthStore` (Zustand)

### Data Fetching Pattern
- `IndicatorsCard.tsx` obtiene incidencias con `getDocs(query(collection(db, 'IncidenciasEU')))`
- Los datos se filtran por: `prioridad` (CRITICA) y `estado` (RESUELTO)
- Se calcula en tiempo real: total, críticas, activas, resueltas

### Notifications Architecture
- Centro de notificaciones global en `NotificationCenter.tsx`
- Se disparan con `addNotification(message, type, duration)` desde `useNotificationStore`
- Tipos: `success | error | warning | info`
- Se renderiza en el centro de la pantalla con animaciones Framer Motion

### Animations & Transitions
- **Framer Motion** para todas las animaciones
- **Patterns usados**:
  - `initial={{ opacity: 0 }}` + `animate={{ opacity: 1 }}` para fade-in
  - `whileHover={{ scale: 1.05 }}` para efectos hover
  - `variants` + `staggerChildren` para animaciones en cascada
  - `transition={{ type: 'spring', damping: 20 }}` para suavidad tipo Figma

## Code Conventions

### Component Structure
```typescript
// 1. Imports (React, Libraries, Local)
import React from 'react';
import { motion } from 'framer-motion';

// 2. Interfaces/Types
interface ComponentProps {
  title: string;
}

// 3. Component Declaration (Arrow function + React.FC)
export const MyComponent: React.FC<ComponentProps> = ({ title }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Handlers
  const handleClick = () => {};
  
  // 7. Render
  return (...);
};
```

### Naming Conventions
- **Archivos componentes**: PascalCase + `.tsx`
- **Archivos utilidades**: camelCase + `.ts`
- **Variables/funciones**: camelCase
- **Interfaces/Types**: PascalCase con prefijo `I` o sin prefijo
- **Clases Tailwind**: clase-separada-por-guiones

### Color System
```js
// tailwind.config.js
colors: {
  primary: '#FF6B35',      // Naranja - botones principales
  secondary: '#004E89',    // Azul - fondo sidebar/login
  accent: '#F7B801',       // Amarillo - acentos
}
```

## Firebase Integration Points

### Collections
- **IncidenciasEU**: Colección principal
  - Estructura esperada:
    ```typescript
    {
      id: string;
      tipo: string;
      descripcion: string;
      estado: 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO';
      fechaCreacion: string;
      prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
      usuario: string;
      meta?: Record<string, any>;
    }
    ```

### Auth Methods
- `signInWithEmailAndPassword(auth, email, password)`
- `signOut(auth)`
- `onAuthStateChanged(auth, callback)`

## Important Developer Workflows

### Build & Deploy
```bash
npm run dev          # Desarrollo local (puerto 5173)
npm run build        # Producción (optimizado)
npm run preview      # Preview de build
```

### Adding New Features
1. **Componentes**: Crea en `src/components/` con Framer Motion
2. **Páginas**: Crea en `src/pages/` + agrega en App.tsx router
3. **Datos**: Añade queries en componentes con Firestore
4. **State global**: Extiende stores en `src/config/store.ts`
5. **Tipos**: Define en `src/types/` para TypeScript

### Common Tasks

**Agregar notificación**:
```typescript
const addNotification = useNotificationStore(s => s.addNotification);
addNotification('¡Éxito!', 'success');
```

**Agregar animación**:
```typescript
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Content
</motion.div>
```

**Obtener datos de Firestore**:
```typescript
const querySnapshot = await getDocs(query(collection(db, 'IncidenciasEU')));
const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

## Known Limitations & TODOs

- [ ] Logout limpia la sesión pero no hay confirmación
- [ ] No hay manejo de errores de red en IndicatorsCard
- [ ] Sidebar responsive en móvil necesita mejoras
- [ ] Agregar tabla detallada de incidencias
- [ ] Implementar filtros y búsqueda
- [ ] Agregar gráficos (Chart.js o Recharts)

## Testing & Debugging

- **DevTools**: Usa React DevTools + Framer Motion inspector
- **Console errors**: Revisa `console.error` para Firebase errors
- **Styles**: Usa `@apply` en `index.css` para utilidades personalizadas

---

**Última actualización**: 26 de noviembre, 2025
**Mantenedor**: Desarrollo WEBLEU
