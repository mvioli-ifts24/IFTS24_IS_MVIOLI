/**
 *
 * Exportación centralizada de todos los componentes del sistema de diseño.
 * Organizado siguiendo Atomic Design methodology.
 *
 * De esta forma podemos importar cualquier componente desde 'ui' sin preocuparnos por su ubicación interna.
 * Ejemplo:
 * import { Button, Heading, ThemeToggle } from 'ui'
 *
 * Esto mejora la mantenibilidad y escalabilidad del proyecto a medida que crece.
 */

// Tipos compartidos
export type { ColorVariant, Size, StyleVariant, Weight } from './types'

// ================================
// ATOMS - Componentes básicos
// ================================

export {
  Button,
  type ButtonColor,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant
} from './atoms/Button'
export {
  Input,
  type InputProps,
  type InputSize,
  type InputState,
  type InputVariant
} from './atoms/Input'

export { DatePicker, type DatePickerProps } from './atoms/DatePicker'

export { Select, type SelectProps } from './atoms/Select'

export { Checkbox, type CheckboxProps } from './atoms/Checkbox'

export { Avatar, type AvatarFallback, type AvatarProps, type AvatarSize } from './atoms/Avatar'

export {
  Heading,
  type HeadingLevel,
  type HeadingProps,
  type HeadingSize,
  type HeadingVariant
} from './atoms/Heading'

export {
  Text,
  type TextProps,
  type TextSize,
  type TextVariant,
  type TextWeight
} from './atoms/Text'

export { SpinLoader, type SpinLoaderProps, type SpinLoaderSize } from './atoms/SpinLoader'

export { Tag, type TagProps, type TagVariant } from './atoms/Tag'

export { AnimatedCounter } from './atoms/AnimatedCounter'

export { CardWrapper, type CardWrapperProps } from './atoms/CardWrapper'

export { Logo, type LogoProps } from './atoms/Logo'

export { Separator, type SeparatorProps } from './atoms/Separator'

// ================================
// MOLECULES - Componentes compuestos
// ================================

export { CardBorderGlow, type CardBorderGlowProps } from './molecules/CardBorderGlow'

export { AvatarUpload, type AvatarUploadProps } from './molecules/AvatarUpload'

export { ThemeToggle, type ThemeToggleProps } from './molecules/ThemeToggle'

// ================================
// ORGANISMS - Componentes complejos
// ================================

export { Navbar } from './organisms/Navbar'

export { UserMenu } from './organisms/UserMenu'

export { Sidebar } from './organisms/Sidebar'

// ================================
// LAYOUTS - Estructuras de página
// ================================

export { UserDashboard } from './layouts/UserDashboard'
