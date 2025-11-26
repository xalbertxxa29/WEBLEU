# WEBLEU - Dashboard Moderno con Firebase

Dashboard profesional y moderno con autenticación Firebase, indicadores en tiempo real y efectos tipo Figma.

## 🚀 Características

- ✅ Autenticación con Firebase
- ✅ Dashboard con indicadores en tiempo real
- ✅ Menú hamburguesa moderno
- ✅ Transiciones y efectos tipo Figma (Framer Motion)
- ✅ Notificaciones estéticas y centradas
- ✅ Diseño responsive
- ✅ Dark/Light optimizado

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## ⚙️ Configuración Firebase

1. Abre `src/config/firebase.ts`
2. Reemplaza los valores con tus credenciales de Firebase:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── NotificationCenter.tsx    # Centro de notificaciones
│   ├── Sidebar.tsx                # Menú hamburguesa
│   └── IndicatorsCard.tsx         # Tarjetas de indicadores
├── pages/
│   ├── LoginPage.tsx              # Página de inicio de sesión
│   └── DashboardPage.tsx          # Panel de control
├── config/
│   ├── firebase.ts                # Configuración Firebase
│   └── store.ts                   # Gestión de estado (Zustand)
├── types/
│   └── incidents.ts               # Tipos TypeScript
├── App.tsx                        # Componente principal
└── main.tsx                       # Punto de entrada
```

## 🎨 Colores del Tema

- **Primary**: #FF6B35 (Naranja)
- **Secondary**: #004E89 (Azul oscuro)
- **Accent**: #F7B801 (Amarillo)

## 📊 Integración con Firestore

La aplicación obtiene datos de la colección `IncidenciasEU` con los siguientes campos:

```typescript
{
  tipo: string,
  descripcion: string,
  estado: string,
  fechaCreacion: string,
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
  usuario: string,
  // ... otros campos
}
```

## 🛠️ Tecnologías Usadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animaciones)
- Firebase (Auth + Firestore)
- Zustand (state management)
- Lucide React (iconos)

## 📝 Notas

- El logo se usa de `src/assets/logo_liberman.png`
- Las transiciones están optimizadas para rendimiento
- El código sigue las convenciones de React moderno

---

¡Disfruta tu nuevo dashboard! 🎉
