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
} from './atoms/inputs/Input'

export { DatePicker, type DatePickerProps, type DatePickerSize } from './atoms/inputs/DatePicker'

export { Select, type SelectOption, type SelectProps, type SelectSize } from './atoms/inputs/Select'

export { Checkbox, type CheckboxProps } from './atoms/inputs/Checkbox'

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
  type TextColor,
  type TextProps,
  type TextSize,
  type TextVariant,
  type TextWeight
} from './atoms/Text'

export { SpinLoader, type SpinLoaderProps, type SpinLoaderSize } from './atoms/SpinLoader'

export { Tag, type TagProps, type TagVariant } from './atoms/Tag'

export { AnimatedCounter, type AnimatedCounterProps } from './atoms/AnimatedCounter'

export { CardWrapper, type CardWrapperProps } from './atoms/CardWrapper'

export { Skeleton, type SkeletonProps } from './atoms/skeleton/Skeleton'

export { PageSkeleton, type PageSkeletonProps } from './atoms/skeleton/PageSkeleton'

export { Logo, type LogoProps } from './atoms/Logo'

export { Separator, type SeparatorProps } from './atoms/Separator'

export { Modal, type ModalProps } from './atoms/Modal'

export { StarRating, type StarRatingProps } from './atoms/StarRating'

export { SearchInput, type SearchInputProps } from './atoms/inputs/SearchInput'

export { Toggle, type ToggleColor, type ToggleProps } from './atoms/inputs/Toggle'

export { ConfirmActionModal, type ConfirmActionModalProps } from './molecules/ConfirmActionModal'

export { Paginator, type PaginatorProps } from './molecules/table/Paginator'

// ================================
// MOLECULES - Componentes compuestos
// ================================

export { CardBorderGlow, type CardBorderGlowProps } from './molecules/CardBorderGlow'

export { AvatarUpload, type AvatarUploadProps } from './molecules/AvatarUpload'

export { ReviewCard, type ReviewCardProps } from './molecules/ReviewCard'

export { ThemeToggle, type ThemeToggleProps } from './molecules/ThemeToggle'

export {
  DropdownMenu,
  type DropdownMenuItemDef,
  type DropdownMenuProps
} from './molecules/DropdownMenu'

export { ImageUpload, type ImageUploadProps, type ImageUploadState } from './molecules/ImageUpload'

export {
  TableFilters,
  type FilterGroup,
  type FilterOption,
  type TableFiltersProps
} from './molecules/table/TableFilters'

export {
  Table,
  type ColumnDef,
  type TableActionDef,
  type TableProps
} from './molecules/table/Table'

export { SearchFilterBar, type SearchFilterBarProps } from './molecules/table/SearchFilterBar'

export {
  LogoLoop,
  type LogoImageItem,
  type LogoItem,
  type LogoLoopDirection,
  type LogoLoopProps,
  type LogoNodeItem
} from './molecules/LogoLoop'

// ================================
// ORGANISMS - Componentes complejos
// ================================

export { SearchFiltersTable, type SearchFiltersTableProps } from './organisms/SearchFiltersTable'

export { Navbar, type NavbarProps } from './organisms/Navbar'

export { UserMenu, type UserMenuProps } from './organisms/UserMenu'

export { Sidebar, type SidebarProps } from './organisms/Sidebar'

// ================================
// LAYOUTS - Estructuras de página
// ================================

export { UserDashboard } from './layouts/UserDashboard'
