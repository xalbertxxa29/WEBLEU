# 📊 WEBLEU - Dashboard de Indicadores

**Dashboard moderno de indicadores con autenticación Firebase y gráficos interactivos.**

## ✨ Características

- 🔐 **Autenticación Firebase** - Login seguro
- 📈 **Gráficos Modernos** - Líneas, barras, pastel con Recharts
- 📋 **Tabla Interactiva** - Búsqueda, filtrado y ordenamiento
- 📸 **Visor de Imágenes** - Modal con zoom para evidencias
- 🎨 **Diseño Moderno** - Tailwind CSS + Framer Motion
- 📱 **Responsive** - Funciona en móvil, tablet y desktop
- ⚡ **Rendimiento** - Optimizado con Vite
- 🔄 **KPI Facility & Security** - Vistas organizadas por KPI

## 🚀 Quick Start

### Requisitos
- Node.js 16+ 
- npm o yarn
- Credenciales de Firebase

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/xalbertxxa29/WEBLEU.git
cd WEBLEU

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase
```

### Desarrollo

```bash
npm run dev
# Abre http://localhost:5173
```

### Producción

```bash
npm run build      # Genera carpeta 'dist/'
npm run preview    # Previsualiza la build
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── IndicatorsCard.tsx       # Tarjetas de estadísticas
│   ├── ChartsSection.tsx        # Gráficos (línea, barras, pastel)
│   ├── TablaIncidencias.tsx     # Tabla interactiva con zoom
│   ├── NotificationCenter.tsx   # Centro de notificaciones
│   └── Sidebar.tsx              # Menú lateral
├── pages/                # Páginas principales
│   ├── DashboardPage.tsx        # Panel principal con KPI
│   ├── TablaPage.tsx            # Página de tabla
│   └── LoginPage.tsx            # Autenticación
├── config/               # Configuración
│   ├── firebase.ts              # Firebase setup
│   └── store.ts                 # Zustand stores
├── types/               # TypeScript interfaces
│   └── incidents.ts             # Tipos de incidencias
└── assets/              # Recursos
    └── logo_liberman.png        # Logo empresa
```

## 🔑 Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 📊 Estructura de Datos (Firestore)

Collection `IncidenciasEU`:

```javascript
{
  id: string;
  nombreAgente: string;
  punto: string;
  estado: 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  observacion: string;
  evidenciaDataUrl: string; // base64 image
  createdAt: Timestamp;
}
```

## 🎨 Paleta de Colores

- **Primary (Naranja)**: `#FF6B35` - Botones y acciones
- **Secondary (Azul)**: `#004E89` - Headers y fondos
- **Accent (Amarillo)**: `#F7B801` - Acentos

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State**: Zustand
- **Auth**: Firebase Authentication
- **Database**: Firestore
- **Icons**: Lucide React
- **Build**: Vite

## 📦 Scripts

```bash
npm run dev          # Servidor de desarrollo (http://localhost:5173)
npm run build        # Build para producción
npm run preview      # Previsualiza la build
npm run lint         # Ejecuta linter
```

## 🚢 Despliegue

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para:
- Netlify
- Vercel
- Servidor propio
- GitHub Pages

## 🔒 Seguridad

- ✅ Variables de entorno en `.env.local` (no en git)
- ✅ Firebase Auth habilitado
- ✅ Firestore rules configuradas
- ✅ CORS configurado en Firebase

## 📝 Notas

- El logo se encuentra en `src/assets/logo_liberman.png`
- Todos los gráficos cargan datos en tiempo real de Firestore
- Las imágenes en la tabla se muestran en base64 desde Firestore
- El modal de zoom de imágenes se puede cerrar con ESC o click fuera

## 🐛 Troubleshooting

**Error de Firebase 400:**
- Verifica que `.env.local` tenga credenciales correctas
- Comprueba que Firebase Auth esté habilitado

**Gráficos vacíos:**
- Verifica que `IncidenciasEU` tenga documentos en Firestore
- Comprueba que los campos coincidan (createdAt, nombreAgente, punto, etc)

**Tabla no muestra imágenes:**
- Verifica que `evidenciaDataUrl` esté en base64
- Comprueba que el formato sea `data:image/jpeg;base64,...`

## 📚 Recursos

- [Documentación Vite](https://vitejs.dev)
- [Documentación React](https://react.dev)
- [Documentación Tailwind](https://tailwindcss.com)
- [Documentación Firebase](https://firebase.google.com/docs)
- [Documentación Framer Motion](https://www.framer.com/motion/)
- [Documentación Recharts](https://recharts.org)

## 📄 Licencia

Proyecto privado - Liderman EU

## 👨‍💻 Autor

Desarrollo WEBLEU - Noviembre 2025

---

**Para soporte o reportar bugs, contacta al equipo de desarrollo.**
