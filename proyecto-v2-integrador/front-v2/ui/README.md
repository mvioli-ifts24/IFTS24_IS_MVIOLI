# UI – Sistema de Diseño

Sistema de componentes basado en **Atomic Design**. Todos los componentes de esta carpeta son **agnósticos**: no conocen el estado de autenticación, no importan stores de features ni lógica de negocio. Solo reciben props y renderizan.

## Regla fundamental

> **Si un componente necesita saber quién es el usuario o qué permisos tiene, no pertenece a `ui/`.**
> Esa lógica va en el layout o en la feature correspondiente.

---

## Estructura

```
ui/
├── atoms/          # Elementos básicos, indivisibles
├── molecules/      # Combinaciones de átomos
├── organisms/      # Secciones completas de UI (navbar, sidebar, etc.)
├── layouts/        # Estructuras de página (smart: única excepción a la regla)
├── index.ts        # Barrel export centralizado
└── types.ts        # Tipos compartidos del sistema (Size, Weight, ColorVariant, etc.)
```

---

## Cómo importar

Siempre importar desde el barrel `@/ui`, nunca desde rutas internas:

```tsx
// ✅ Correcto
import { Button, Heading, Text, SpinLoader } from '@/ui'

// ❌ Incorrecto
import { Button } from '@/ui/atoms/Button'
```

---

## Niveles de Atomic Design

### Atoms — `/ui/atoms/`

Unidades mínimas, sin dependencias internas.

| Componente        | Descripción                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `Button`          | Botón o link. Acepta `variant`, `color`, `size`, `href`, `iconLeft`, `iconRight`, `isLoading` |
| `Input`           | Campo de texto con label, mensaje de error y variantes                                        |
| `DatePicker`      | Selector de fecha                                                                             |
| `Select`          | Lista desplegable                                                                             |
| `Checkbox`        | Casilla de verificación                                                                       |
| `Avatar`          | Avatar circular con fallback a inicial                                                        |
| `Heading`         | Títulos semánticos (`h1`–`h6`) con tamaño visual desacoplado del nivel                        |
| `Text`            | Párrafos y textos con variantes de color y peso                                               |
| `SpinLoader`      | Indicador de carga con `label` opcional                                                       |
| `Tag`             | Etiqueta inline con variantes de color                                                        |
| `AnimatedCounter` | Número animado                                                                                |
| `CardWrapper`     | Contenedor con sombra y elevación configurable                                                |
| `Logo`            | Logotipo del proyecto                                                                         |
| `Separator`       | Línea divisora                                                                                |
| `Modal`           | Base modal con focus trap y backdrop                                                          |
| `SearchInput`     | Input especializado para búsqueda con ícono                                                   |

### Molecules — `/ui/molecules/`

Combinaciones de átomos con comportamiento simple.

| Componente       | Descripción                                  |
| ---------------- | -------------------------------------------- |
| `AvatarUpload`   | Avatar + botón de subida de archivo          |
| `ThemeToggle`    | Botón para cambiar entre tema claro y oscuro |
| `CardBorderGlow` | Tarjeta con efecto de borde brillante        |

### Organisms — `/ui/organisms/`

Secciones completas. Reciben datos por props, no los obtienen por sí mismos.

| Componente | Props clave                                       | Notas                                                                     |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| `Navbar`   | `user`, `onLogout`, `onMenuToggle`, `sidebarOpen` | No llama a `useAuthStore` directamente; recibe `onLogout` desde el layout |
| `Sidebar`  | `user`, `isOpen`, `onClose`                       | Filtra items de navegación según `user.role`                              |
| `UserMenu` | `user`, `onLogout`                                | Menú desplegable del usuario; `onLogout` viene del layout                 |

**Patrón de props hacia abajo:**

```
UserDashboard (layout) → Navbar → UserMenu
                       → Sidebar
```

El layout es el único lugar que llama a `useAuthStore` y define el `handleLogout`.

### Layouts — `/ui/layouts/`

Única excepción a la regla de agnosticismo: los layouts son **smart** porque necesitan proteger rutas y proveer datos a sus hijos.

| Componente      | Props                          | Descripción                                                                                             |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `UserDashboard` | `children`, `role: UserRole[]` | Layout principal del dashboard. Valida autenticación via `useAuthRouteGuard`. Muestra Navbar + Sidebar. |

---

## Tipos compartidos (`ui/types.ts`)

```ts
type Size = 'xs' | 'sm' | 'm' | 'lg' | 'xl'
type Weight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
type ColorVariant = 'default' | 'primary' | 'secondary' | 'muted' | 'gradient'
type StyleVariant = 'filled' | 'outlined' | 'text' | 'action'
```

Importar desde `@/ui` (re-exportados en el barrel):

```tsx
import type { ColorVariant, Size } from '@/ui'
```

---

## Ejemplos de uso

### Botón básico

```tsx
<Button variant="filled" color="primary" size="m">
  Guardar
</Button>
```

### Botón como link

```tsx
<Button href="/dashboard" variant="text" color="primary">
  Ir al dashboard
</Button>
```

### Botón con loading

```tsx
<Button isLoading={form.formState.isSubmitting} type="submit">
  Enviar
</Button>
```

### Heading con nivel semántico desacoplado del tamaño visual

```tsx
// h1 semántico con tamaño visual pequeño
<Heading level="h1" size="sm" variant="primary">
  Título de sección
</Heading>
```

### Modal

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Editar perfil">
  {/* contenido */}
</Modal>
```

### SpinLoader

```tsx
// Pantalla completa
<SpinLoader />

// Inline con label
<SpinLoader label="Cargando perfil..." size="sm" />
```

---

## Reglas de contribución

1. **Sin imports de `@/features/`** en ningún componente excepto `ui/layouts/`. Si un organism necesita datos de una feature, recíbelos por prop.
2. **Sin lógica de negocio**: validaciones, llamadas a API y transformaciones van en la feature.
3. **Nuevo componente**: agregar el export en `ui/index.ts` en la sección que corresponda.
4. **Nombrado**: PascalCase para componentes, camelCase para hooks y utilidades.
5. **Tipado**: siempre exportar el tipo de props junto con el componente (`export type ButtonProps`).
