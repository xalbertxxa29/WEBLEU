# 🚀 WEBLEU - Guía de Inicio Rápido

¡Tu dashboard moderno está listo para desarrollar! Aquí está todo lo que necesitas saber.

## 📋 Resumen de Lo Que Se Creó

✅ **Estructura completa React + Vite**
✅ **Autenticación Firebase integrada**
✅ **Dashboard con indicadores en tiempo real**
✅ **Menú hamburguesa moderno con Framer Motion**
✅ **Notificaciones estéticas y centradas**
✅ **Configuración Tailwind CSS**
✅ **TypeScript configurado**

## ⚡ Próximos Pasos

### 1️⃣ Configurar Firebase (IMPORTANTE)

```bash
# En la carpeta del proyecto, copia el archivo de ejemplo
cp .env.example .env.local
```

**Luego abre `.env.local` y completa tus credenciales de Firebase:**
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 2️⃣ Instalar dependencias (si no lo hizo automáticamente)

```bash
npm install
```

### 3️⃣ Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrirá automáticamente: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
WEBLEU/
├── src/
│   ├── components/
│   │   ├── NotificationCenter.tsx    # 🔔 Notificaciones (centro de pantalla)
│   │   ├── Sidebar.tsx               # ☰ Menú hamburguesa
│   │   └── IndicatorsCard.tsx        # 📊 Tarjetas de estadísticas
│   ├── pages/
│   │   ├── LoginPage.tsx             # 🔐 Login con Firebase
│   │   └── DashboardPage.tsx         # 📈 Panel principal
│   ├── config/
│   │   ├── firebase.ts               # 🔥 Configuración Firebase
│   │   └── store.ts                  # 🏪 Zustand stores
│   ├── types/
│   │   └── incidents.ts              # 📋 Tipos TypeScript
│   ├── assets/
│   │   └── logo_liberman.png         # 🎨 Logo de la empresa
│   ├── App.tsx                       # 🎯 Componente principal
│   └── main.tsx                      # ⚙️ Punto de entrada
├── .env.example                      # 📝 Plantilla de variables
├── .github/copilot-instructions.md   # 🤖 Instrucciones para IA
├── package.json                      # 📦 Dependencias
├── tailwind.config.js                # 🎨 Colores y tema
└── vite.config.ts                    # ⚡ Configuración Vite
```

## 🎨 Colores del Tema

- **Primary** (Naranja): #FF6B35
- **Secondary** (Azul): #004E89  
- **Accent** (Amarillo): #F7B801

## 🔑 Puntos Clave de Arquitectura

### 🔐 Autenticación
- Monitoreo automático en `App.tsx` con `onAuthStateChanged()`
- Estado sincronizado con Zustand
- Redirección automática Login ↔ Dashboard

### 📊 Datos en Tiempo Real
- Obtención desde `IncidenciasEU` (colección Firebase)
- Cálculo automático: Total, Críticas, Activas, Resueltas
- Refrescado al montar el componente

### 🎬 Animaciones (Framer Motion)
- Transiciones suaves tipo Figma
- Efectos hover interactivos
- Animaciones en cascada para listas

### 🔔 Notificaciones
- Centro global de notificaciones
- Tipos: success, error, warning, info
- Se desaparecen automáticamente después de 3 segundos

## 💻 Comandos Útiles

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Compilar para producción
npm run preview     # Ver build en local
npm run lint        # Validar código
```

## 🚀 Para Agregar Nuevas Características

### Agregar un Nuevo Componente
```typescript
// src/components/MiComponente.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MiComponenteProps {
  titulo: string;
}

export const MiComponente: React.FC<MiComponenteProps> = ({ titulo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg"
    >
      {titulo}
    </motion.div>
  );
};
```

### Agregar una Notificación
```typescript
import { useNotificationStore } from '../config/store';

const addNotification = useNotificationStore(s => s.addNotification);
addNotification('¡Operación exitosa!', 'success');
```

### Obtener Datos de Firestore
```typescript
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const querySnapshot = await getDocs(query(collection(db, 'IncidenciasEU')));
const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

## 🐛 Solución de Problemas

**Error: "Cannot find module 'firebase'"**
→ Ejecuta `npm install` nuevamente

**Las notificaciones no aparecen**
→ Verifica que `NotificationCenter` esté en `App.tsx`

**Login no funciona**
→ Asegúrate que `.env.local` tiene las credenciales correctas

**Animaciones lentas**
→ Reduce transiciones en `damping` de Framer Motion (default: 20)

## 📚 Recursos Adicionales

- [Documentación React](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [Zustand](https://github.com/pmndrs/zustand)

## 📞 Notas

- El logo se ubicó automáticamente en `src/assets/logo_liberman.png`
- Las instrucciones para agentes IA están en `.github/copilot-instructions.md`
- TypeScript está configurado con strict mode activado
- Tailwind está optimizado para producción

---

**¡Listo para desarrollar! 🎉**

Cualquier pregunta, revisa `.github/copilot-instructions.md` para más detalles técnicos.
