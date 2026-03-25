'use client'

import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import { Input } from './Input'

/**
 * Props para el componente SearchInput
 */
export interface SearchInputProps {
  /**
   * ID único del input para asociar con la etiqueta
   */
  id: string

  /**
   * Texto de la etiqueta flotante
   */
  label: string

  /**
   * Valor actual del input de búsqueda
   */
  value: string

  /**
   * Callback ejecutado cuando cambia el valor del input
   * @param value - Nuevo valor ingresado
   */
  onChange: (value: string) => void

  /**
   * Callback opcional ejecutado cuando el input recibe el foco
   */
  onFocus?: () => void

  /**
   * Callback opcional ejecutado cuando el input pierde el foco
   */
  onBlur?: () => void

  /**
   * Desactiva el input para edición
   * @default false
   */
  disabled?: boolean
}

/**
 * Componente SearchInput reutilizable
 *
 * Input especializado para búsqueda con icono magnifying glass integrado.
 * Mantiene la etiqueta siempre en la parte superior y proporciona una experiencia
 * de búsqueda consistente en toda la aplicación.
 *
 * Es un componente puro (presentacional) que no contiene lógica de negocio.
 * La orquestación de búsqueda y filtrado debe hacerse en componentes padres.
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('')
 *
 * <SearchInput
 *   id="game-search"
 *   label="Buscar juego"
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onFocus={() => setShowDropdown(true)}
 *   disabled={isLoading}
 * />
 * ```
 */
export function SearchInput({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false
}: SearchInputProps) {
  return (
    <div className="w-full">
      <Input
        labelAlwaysTop
        disabled={disabled}
        iconLeft={<MagnifyingGlassIcon size={18} />}
        id={id}
        label={label}
        onBlur={onBlur}
        onChange={event => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder="Buscar"
        value={value}
      />
    </div>
  )
}
