# API v2 - Rank Gaming Platform

Backend API para la plataforma de reseñas de juegos Rank, construida con Node.js, Express y MySQL.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- MySQL (versión 8.0 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd proyecto-v2-integrador/api-v2
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copiar el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

   Editar `.env` con tus configuraciones:

   ```env
   PORT=3001
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=tu_usuario_mysql
   MYSQL_PASS=tu_password_mysql
   MYSQL_DB=rank
   SECRET_KEY=tu_clave_secreta_jwt
   API_HOST=http://localhost:3001
   ```

4. **Inicializar la base de datos**

   Opción A - Setup completo (recomendado para instalación nueva):

   ```bash
   npm run setup
   ```

   Opción B - Solo inicializar base de datos (si ya tienes las dependencias):

   ```bash
   npm run db:init
   ```

   Opción C - Resetear base de datos completamente:

   ```bash
   npm run db:reset
   ```

   > **Nota:** El script de inicialización detecta automáticamente si necesitas migrar de la estructura antigua (con `is_admin`/`is_moderator`) a la nueva estructura unificada con el campo `role`. No necesitas preocuparte por migraciones manuales.

5. **Iniciar el servidor**

   Modo desarrollo (con recarga automática):

   ```bash
   npm run dev
   ```

   Modo producción:

   ```bash
   npm start
   ```

El servidor estará disponible en `http://localhost:3001`

## 📊 Base de Datos

### Estructura

La base de datos incluye las siguientes tablas:

- `users` - Usuarios del sistema
- `users_genders` - Géneros de usuario
- `games_reviews` - Reseñas de juegos
- `games_reviews_ratings` - Ratings disponibles (1-5)
- `cached_games` - Juegos cacheados de API externa
- `contact_messages` - Mensajes de contacto
- `banners` - Banners publicitarios
- `sponsors` - Patrocinadores

### Usuario Administrador por Defecto

Después de la inicialización, se crea automáticamente un usuario administrador:

- **Email:** admin@rank.com
- **Contraseña:** admin123
- **Rol:** admin

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm start` - Inicia el servidor en modo producción
- `npm run db:init` - Inicializa la base de datos con todas las tablas y datos
- `npm run db:check` - Verifica el estado y estructura de la base de datos
- `npm run db:reset` - Elimina y recrea la base de datos completamente
- `npm run setup` - Instala dependencias e inicializa la base de datos

## 📁 Estructura del Proyecto

```
api-v2/
├── database/
│   ├── connection.js          # Conexión a MySQL
│   ├── init.sql              # Script de inicialización
│   ├── migrations/           # Archivos SQL de creación de tablas
│   └── seeders/              # Datos iniciales
├── public/
│   └── uploads/              # Archivos subidos (imágenes)
├── routes/                   # Definición de rutas API
├── src/
│   ├── controllers/          # Lógica de negocio
│   └── middlewares/          # Middlewares personalizados
├── .env                      # Variables de entorno
├── .env.example              # Ejemplo de variables de entorno
├── package.json
└── server.js                 # Punto de entrada de la aplicación
```

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación. Los endpoints protegidos requieren un token válido en el header `Authorization`.

### Roles de Usuario

- `user` - Usuario regular
- `moderator` - Moderador (puede gestionar reseñas)
- `admin` - Administrador (acceso completo)

## 📡 Endpoints Principales

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Usuarios

- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario específico
- `PUT /users` - Actualizar perfil propio

### Administración (requiere rol admin)

- `POST /admin/users` - Crear administrador
- `PUT /admin/users/:id/moderator` - Asignar/quitar rol moderador
- `DELETE /admin/users/:id` - Eliminar usuario
- `GET /admin/stats` - Estadísticas del sistema

### Banners y Sponsors

- `GET /banners` - Listar banners
- `POST /admin/banners` - Crear banner
- `PUT /admin/banners/:id` - Actualizar banner
- `DELETE /admin/banners/:id` - Eliminar banner

_(Para endpoints completos, revisar la colección de Insomnia)_

## 🧪 Testing

Para probar la API, puedes usar:

- La colección de Insomnia incluida: `insomnia_collection.json`
- Postman
- curl

## 🚨 Solución de Problemas

### Error de conexión a MySQL

- Verificar que MySQL esté ejecutándose
- Comprobar las credenciales en `.env`
- Asegurarse de que la base de datos `rank` exista

### Puerto ya en uso

- Cambiar el puerto en `.env` o liberar el puerto 3001
- En macOS/Linux: `lsof -ti:3001 | xargs kill -9`

### Errores de permisos en uploads

- Asegurarse de que la carpeta `public/uploads/` tenga permisos de escritura
- `chmod 755 public/uploads/`

## 📝 Notas de Desarrollo

- El proyecto usa ES modules (`"type": "module"` en package.json)
- Las rutas se importan usando aliases (`#database`, `#controllers/*`)
- La base de datos usa prepared statements para prevenir SQL injection
- Los archivos subidos se almacenan en `public/uploads/`

## 🤝 Contribución

1. Crear una rama para tu feature
2. Hacer commits descriptivos
3. Hacer push y crear Pull Request
4. Esperar revisión y aprobación
