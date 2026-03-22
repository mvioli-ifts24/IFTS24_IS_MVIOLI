# Rank Gaming Platform v2

Plataforma completa de reseñas de juegos con arquitectura moderna: Next.js 16 App Router en el frontend y Node.js/Express con MySQL en el backend.

## 📁 Estructura del Proyecto

```
proyecto-v2-integrador/
├── api-v2/                 # Backend API (Node.js + Express + MySQL)
│   ├── database/          # Migraciones, seeders e inicialización
│   ├── src/               # Código fuente del backend
│   ├── public/            # Archivos estáticos y uploads
│   └── README.md          # Documentación específica del backend
├── front-v2/              # Frontend (Next.js 16 App Router)
│   ├── app/               # App Router de Next.js
│   ├── features/          # Features organizadas por dominio
│   ├── shared/            # Código compartido (tipos, utils, providers)
│   └── ui/                # Componentes de UI reutilizables
└── README.md              # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

### Instalación y Setup

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd proyecto-v2-integrador
   ```

2. **Configurar el Backend**

   ```bash
   cd api-v2
   cp .env.example .env
   # Editar .env con tus configuraciones de MySQL
   npm install
   npm run setup  # Instala dependencias e inicializa la base de datos
   ```

3. **Configurar el Frontend**

   ```bash
   cd ../front-v2
   npm install
   cp .env.example .env.local  # Si existe
   # Configurar variables de entorno si es necesario
   ```

4. **Iniciar los servicios**

   Terminal 1 - Backend:

   ```bash
   cd api-v2
   npm run dev
   ```

   Terminal 2 - Frontend:

   ```bash
   cd front-v2
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

## 🔐 Credenciales por Defecto

Después del setup, se crea automáticamente un usuario administrador:

- **Email:** admin@rank.com
- **Contraseña:** admin123

## 📚 Documentación

- **[Backend API](./api-v2/README.md)** - Documentación completa del backend, incluyendo setup, endpoints y troubleshooting
- **[Frontend](./front-v2/README.md)** - Documentación del frontend (si existe)

## 🏗️ Arquitectura

### Backend (api-v2)

- **Framework:** Node.js + Express
- **Base de datos:** MySQL con migraciones
- **Autenticación:** JWT
- **File Upload:** Multer
- **Validación:** Zod (en frontend, backend usa validación manual)

### Frontend (front-v2)

- **Framework:** Next.js 16 con App Router
- **UI:** Componentes personalizados con Tailwind CSS
- **Estado:** Context API + hooks personalizados
- **Tipos:** TypeScript con tipos compartidos

### Características Principales

- ✅ Sistema de autenticación completo
- ✅ Gestión de usuarios con roles (admin/moderator/user)
- ✅ Sistema de reseñas de juegos
- ✅ Panel de administración
- ✅ Gestión de banners y sponsors
- ✅ Sistema de contacto
- ✅ Upload de imágenes de perfil
- ✅ API RESTful completa

## 🔧 Desarrollo

### Migraciones de Base de Datos

El sistema incluye migración automática para actualizar de versiones anteriores:

- Convierte campos `is_admin`/`is_moderator` a campo unificado `role`
- Mantiene compatibilidad con datos existentes

### Scripts Útiles

```bash
# Backend
cd api-v2
npm run db:init      # Inicializar base de datos
npm run db:check     # Verificar estado de la base de datos
npm run db:reset     # Resetear base de datos completamente
npm run setup        # Setup completo (dependencias + DB)

# Frontend
cd front-v2
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
```

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de conexión MySQL**
   - Verificar que MySQL esté ejecutándose
   - Comprobar credenciales en `api-v2/.env`

2. **Puerto ocupado**

   ```bash
   # Liberar puerto 3001 (backend)
   lsof -ti:3001 | xargs kill -9

   # Liberar puerto 3000 (frontend)
   lsof -ti:3000 | xargs kill -9
   ```

3. **Problemas de dependencias**
   ```bash
   # Limpiar y reinstalar
   cd api-v2 && rm -rf node_modules && npm install
   cd ../front-v2 && rm -rf node_modules && npm install
   ```

### Logs y Debugging

- Los logs del backend se muestran en la terminal donde se ejecuta `npm run dev`
- Para debugging detallado, revisar la consola del navegador (frontend) y los logs del servidor (backend)

## 🤝 Contribución

1. Crear una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commits descriptivos
3. Hacer push y crear Pull Request
4. Esperar revisión y aprobación

## 📄 Licencia

Este proyecto es parte de un trabajo integrador académico.
