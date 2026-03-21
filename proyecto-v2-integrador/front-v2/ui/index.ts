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

export { AnimatedCounter } from './atoms/AnimatedCounter'

// ================================
// MOLECULES - Combinación de átomos
// ================================

export { ThemeToggle, type ThemeToggleProps } from './molecules/ThemeToggle'
