# 🚀 WEBLEU - Guía de Despliegue y Producción

## 📋 Contenidos

### Carpetas Importantes:
- **`dist/`** - Archivos de producción listos para desplegar (generado con `npm run build`)
- **`src/`** - Código fuente de la aplicación (desarrollo)
- **`node_modules/`** - Dependencias del proyecto

---

## 🎯 Versión de Desarrollo

Para trabajar localmente durante el desarrollo:

```bash
cd c:\Users\jsolis\Desktop\WEBLEU
npm install        # Instala dependencias (solo la primera vez)
npm run dev        # Inicia servidor en http://localhost:5173
```

**Características:**
- Hot reload (cambios en tiempo real)
- Mensajes de error en consola
- Modo debug activo

---

## 🏭 Versión de Producción (Build)

Para crear una versión optimizada para desplegar:

```bash
cd c:\Users\jsolis\Desktop\WEBLEU
npm run build      # Genera carpeta 'dist/'
npm run preview    # Previsualiza la build en http://localhost:4173
```

**Archivos generados en `dist/`:**
- `index.html` - Archivo principal HTML
- `assets/index-*.js` - JavaScript minificado y comprimido
- `assets/index-*.css` - Estilos minificados
- `assets/logo_liberman-*.png` - Logo optimizado

---

## 📦 Opciones de Despliegue

### 1️⃣ **Netlify (Recomendado para principiantes)**
```
1. Entra a https://app.netlify.com
2. Conecta tu repositorio GitHub
3. Configura build: npm run build
4. Publish directory: dist/
5. ¡Hecho! Tu web estará en vivo
```

### 2️⃣ **Vercel**
```
1. Entra a https://vercel.com
2. Importa tu proyecto desde GitHub
3. Vercel detecta Vite automáticamente
4. ¡Hecho! Tu web estará lista
```

### 3️⃣ **Servidor propio (Apache, Nginx)**
```
1. Copia la carpeta 'dist/' a tu servidor
2. Configura el servidor para servir index.html
3. Asegúrate que las rutas apunten a index.html (SPA)
```

### 4️⃣ **GitHub Pages**
```
1. Configura GitHub Actions para hacer build
2. Publica la carpeta 'dist/' en gh-pages
3. Tu web estará en: https://usuario.github.io/WEBLEU
```

---

## ⚙️ Variables de Entorno

### Desarrollo (`.env.local`):
```env
VITE_FIREBASE_API_KEY=AIzaSyDOb5qp9VEqiMtKGHDGBK4JwAi2M_KkH6Q
VITE_FIREBASE_AUTH_DOMAIN=lidermaneu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lidermaneu
VITE_FIREBASE_STORAGE_BUCKET=lidermaneu.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=84620702148
VITE_FIREBASE_APP_ID=1:84620702148:web:268b35c35857a38d093491
```

### Producción:
Asegúrate que tu servicio de hosting tenga estas variables de entorno configuradas en su panel.

---

## 📊 Performance

**Tamaño del Bundle:**
- JavaScript: ~1.1 MB (minificado)
- CSS: ~25 KB (minificado)
- Logo: ~1.5 MB
- **Total: ~2.6 MB** (sin comprimir)

**Después de gzip:**
- ~301 KB (JS)
- ~4.9 KB (CSS)
- **Total comprimido: ~306 KB**

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor local
npm run build           # Genera build de producción
npm run preview         # Previsualiza la build

# Linting
npm run lint            # Valida el código
npm run type-check      # Valida tipos TypeScript

# Instalación
npm install             # Instala todas las dependencias
npm install recharts    # Instala paquetes adicionales
```

---

## 🐛 Solución de Problemas

### **"No funciona la web después de desplegar"**
- ✅ Verifica que el `.env` tenga las credenciales correctas
- ✅ Asegúrate que Firebase Auth esté habilitado
- ✅ Comprueba que la carpeta `dist/` fue desplegada completa

### **"Los gráficos no se ven"**
- ✅ Instala Recharts: `npm install recharts`
- ✅ Reconstruye: `npm run build`

### **"Errores de CORS en Firebase"**
- ✅ Agrega tu dominio en Firebase Console > Authentication > Settings

---

## 📱 Características Desplegadas

✅ Dashboard moderno con KPI Facility/Security
✅ Gráficos interactivos (Líneas, Barras, Pastel)
✅ Tabla de incidencias con búsqueda y filtrado
✅ Visor de imágenes (modal con zoom)
✅ Autenticación Firebase
✅ Menú lateral responsive
✅ Animaciones tipo Figma con Framer Motion
✅ Diseño moderno con Tailwind CSS

---

## 📞 Soporte

Para más información sobre Vite: https://vitejs.dev
Para más información sobre React: https://react.dev
Para más información sobre Firebase: https://firebase.google.com

---

**Última actualización:** 26 de noviembre, 2025
**Build:** Vite 5.4.21 | React 18 | TypeScript
