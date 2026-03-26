# Proyecto Integrador — Front v2

Frontend del Proyecto Integrador IFTS24, desarrollado con **Next.js App Router**, **TypeScript** y **Tailwind CSS**.

## Stack

| Tecnología            | Versión | Rol                     |
| --------------------- | ------- | ----------------------- |
| Next.js               | 16      | Framework (App Router)  |
| React                 | 19      | UI                      |
| TypeScript            | 5       | Tipado estático         |
| Tailwind CSS          | 4       | Estilos                 |
| Zustand               | 5       | Estado global           |
| React Hook Form       | 7       | Formularios             |
| Zod                   | 4       | Validación de esquemas  |
| @phosphor-icons/react | 2       | Iconografía             |
| next-themes           | –       | Tema claro / oscuro     |
| sonner                | –       | Notificaciones (toasts) |

---

## Instalación y ejecución

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Build de producción
npm run lint       # ESLint
npm run format     # Prettier
```

---

## Estructura del proyecto

```
front-v2/
├── app/                    # Rutas (Next.js App Router)
│   ├── layout.tsx          # Layout raíz (ThemeProvider, fuentes)
│   ├── (landing)/          # Rutas públicas (home, login, register)
│   └── (user)/             # Rutas protegidas (dashboard)
│       └── dashboard/
│           ├── layout.tsx          ← wrapper vacío
│           ├── page.tsx            # /dashboard (Inicio)
│           ├── about/page.tsx      # /dashboard/about
│           ├── search/page.tsx     # /dashboard/search
│           ├── help/page.tsx       # /dashboard/help
│           ├── profile/page.tsx    # /dashboard/profile
│           ├── (admin)/            # Guard de rol admin
│           │   ├── layout.tsx      ← redirige si no es admin
│           │   ├── users/          # /dashboard/users
│           │   ├── admins/         # /dashboard/admins
│           │   ├── banners/        # /dashboard/banners
│           │   └── sponsors/       # /dashboard/sponsors
│           └── (reviewer)/         # Guard de rol reviewer
│               ├── layout.tsx      ← redirige si no puede ver reseñas
│               ├── reviews/        # /dashboard/reviews
│               ├── queue/          # /dashboard/queue
│               └── pending/        # /dashboard/pending
├── features/               # Lógica de negocio por dominio
│   ├── auth/               # Login, registro
│   ├── profile/            # Perfil de usuario
│   ├── landing/            # Página de inicio pública
│   ├── reviewer/           # Funcionalidad de reviewers
│   ├── backoffice/         # Administración (en construcción)
│   └── shared/             # Código transversal
├── ui/                     # Sistema de diseño (ver ui/README.md)
└── public/                 # Assets estáticos
```

---

## Alias de paths

```ts
// tsconfig.json
"@/*": ["./*"]
```

Ejemplo:

```ts
import { Button } from '@/ui'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { User } from '@/features/shared/types/user.types'
```

---

## Convenciones de arquitectura

### 1. Features

Cada feature encapsula su propia lógica: página, componentes, servicios, store y schemas.

```
features/<nombre>/
├── pages/          # Componentes de página (lógica + composición)
├── components/     # Componentes específicos de la feature
├── services/       # Llamadas a la API
├── store/          # Estado Zustand local de la feature
└── schemas/        # Schemas Zod para validación de formularios
```

### 2. `features/shared/`

Código transversal utilizado por más de una feature. No es una feature de negocio, pero se ubica aquí para mantener todo bajo `features/`.

```
features/shared/
├── types/          # User, ApiResponse, UserRole
├── hooks/          # useAuthRouteGuard, useAuthHydration
├── store/          # useModalsStore (MODAL_IDS)
├── constants/      # modals.constants.ts
├── providers/      # ThemeProvider
└── utils/          # isRole helper
```

### 3. UI — Sistema de diseño

Los componentes de `ui/` son **completamente agnósticos**: no importan stores, no conocen roles ni lógica de negocio. Reciben todo por props.

Ver [ui/README.md](ui/README.md) para documentación completa.

### 4. App Router — Route Groups

Los paréntesis en los nombres de carpeta (`(admin)`, `(reviewer)`) son **route groups**: agrupan archivos y layouts sin agregar segmento a la URL.

| Carpeta                                        | URL generada         | Protección           |
| ---------------------------------------------- | -------------------- | -------------------- |
| `(user)/dashboard/page.tsx`                    | `/dashboard`         | todos los roles      |
| `(user)/dashboard/(admin)/users/page.tsx`      | `/dashboard/users`   | solo `admin`         |
| `(user)/dashboard/(reviewer)/reviews/page.tsx` | `/dashboard/reviews` | `user` y `moderator` |

El **layout del route group** es responsable de verificar el rol. Si el rol no corresponde, redirige.

---

## Roles de usuario

```ts
type UserRole = 'user' | 'moderator' | 'admin'
```

| Rol         | Acceso                                                                          |
| ----------- | ------------------------------------------------------------------------------- |
| `user`      | Inicio, Búsqueda, Perfil, Sobre Nosotros, Ayuda, Mis Reseñas                    |
| `moderator` | Todo lo de `user` + Cola de Reseñas + Pendientes                                |
| `admin`     | Inicio, Perfil, Sobre Nosotros + Gestión de Usuarios, Admins, Banners, Sponsors |

El Sidebar filtra los items automáticamente según `user.role`. No hay lógica de permisos duplicada en las páginas.

---

## Estado global (Zustand)

| Store             | Ubicación                              | Responsabilidad                            |
| ----------------- | -------------------------------------- | ------------------------------------------ |
| `useAuthStore`    | `features/auth/store/auth.store`       | Usuario autenticado, token, login/logout   |
| `useModalsStore`  | `features/shared/store/modals.store`   | Apertura/cierre de modales por ID          |
| `useProfileStore` | `features/profile/store/profile.store` | Datos de perfil cargados, reviews, loading |

---

## Formularios

Todos los formularios usan **React Hook Form + Zod** mediante `@hookform/resolvers/zod`.

```ts
const form = useForm<Schema>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})
```

Los schemas viven en `features/<nombre>/schemas/`.

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz de `front-v2/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Scripts útiles

```bash
npx tsc --noEmit          # Verificar errores de TypeScript sin compilar
npm run lint:fix           # Corregir errores de ESLint automáticamente
npm run format             # Formatear todos los archivos con Prettier
```
