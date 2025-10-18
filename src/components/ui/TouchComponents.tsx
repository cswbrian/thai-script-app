import React from 'react'
import { motion } from 'framer-motion'

// Touch-friendly button component with minimum 44px height
interface TouchButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'min-h-[44px] touch-button rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 active:bg-yellow-800'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]',
    xl: 'px-8 py-5 text-xl min-h-[52px]'
  }
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${className}
  `.trim()

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-disabled={disabled || loading}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span className="flex-1">{children}</span>
            {icon && iconPosition === 'right' && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </div>
    </motion.button>
  )
}

// Touch-friendly card component
interface TouchCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  hoverable?: boolean
  selected?: boolean
}

const TouchCard: React.FC<TouchCardProps> = ({
  children,
  onClick,
  className = '',
  hoverable = true,
  selected = false
}) => {
  const baseClasses = 'min-h-[44px] touch-button rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const stateClasses = selected
    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
    : hoverable
    ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md active:bg-gray-50'
    : 'border-gray-200 bg-white'
  
  const cardClasses = `${baseClasses} ${stateClasses} ${className}`.trim()

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={cardClasses}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  )
}

// Touch-friendly input component
interface TouchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  disabled?: boolean
  error?: string
  label?: string
  className?: string
  fullWidth?: boolean
}

const TouchInput: React.FC<TouchInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  label,
  className = '',
  fullWidth = false
}) => {
  const baseClasses = 'min-h-[44px] px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-button'
  
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const inputClasses = `${baseClasses} ${stateClasses} ${widthClasses} ${className}`.trim()

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Touch-friendly toggle component
interface TouchToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const TouchToggle: React.FC<TouchToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-11 min-h-[44px]',
    md: 'h-7 w-12 min-h-[44px]',
    lg: 'h-8 w-14 min-h-[44px]'
  }
  
  const thumbSizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7'
  }
  
  const baseClasses = `${sizeClasses[size]} relative inline-flex touch-button rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`
  
  const stateClasses = checked
    ? 'bg-blue-600'
    : 'bg-gray-200'
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  const toggleClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`.trim()

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={toggleClasses}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`${thumbSizeClasses[size]} inline-block transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && (
        <label className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}

// Touch-friendly list item component
interface TouchListItemProps {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const TouchListItem: React.FC<TouchListItemProps> = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon
}) => {
  const baseClasses = 'min-h-[44px] px-4 py-3 flex items-center space-x-3 touch-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
  
  const stateClasses = selected
    ? 'bg-blue-50 border-l-4 border-blue-500'
    : disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:bg-gray-50 active:bg-gray-100'
  
  const listItemClasses = `${baseClasses} ${stateClasses} ${className}`.trim()

  return (
    <motion.div
      whileTap={onClick && !disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={listItemClasses}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-disabled={disabled}
    >
      {leftIcon && (
        <span className="flex-shrink-0 text-gray-400">{leftIcon}</span>
      )}
      <span className="flex-1">{children}</span>
      {rightIcon && (
        <span className="flex-shrink-0 text-gray-400">{rightIcon}</span>
      )}
    </motion.div>
  )
}

// Touch-friendly grid component
interface TouchGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const TouchGrid: React.FC<TouchGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = ''
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }
  
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }
  
  const gridClasses = `grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`.trim()

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

export {
  TouchButton,
  TouchCard,
  TouchInput,
  TouchToggle,
  TouchListItem,
  TouchGrid
}

export type {
  TouchButtonProps,
  TouchCardProps,
  TouchInputProps,
  TouchToggleProps,
  TouchListItemProps,
  TouchGridProps
}
