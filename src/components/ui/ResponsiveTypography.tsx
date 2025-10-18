import React from 'react'
import { motion } from 'framer-motion'

// Responsive typography component with mobile-first approach
interface ResponsiveTextProps {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'white'
  align?: 'left' | 'center' | 'right' | 'justify'
  className?: string
  animate?: boolean
  thai?: boolean
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = '',
  animate = false,
  thai = false
}) => {
  // Mobile-first responsive typography classes
  const variantClasses = {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl',
    body: 'text-sm sm:text-base md:text-lg',
    caption: 'text-xs sm:text-sm md:text-base',
    small: 'text-xs sm:text-xs md:text-sm'
  }
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  }
  
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  }
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
  
  const fontFamilyClasses = thai ? 'thai-font' : ''
  
  const textClasses = `
    ${variantClasses[variant]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${fontFamilyClasses}
    ${className}
  `.trim()

  const TextComponent = animate ? motion.div : 'div'
  
  return (
    <TextComponent
      className={textClasses}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      {children}
    </TextComponent>
  )
}

// Responsive heading component
interface ResponsiveHeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  thai?: boolean
  animate?: boolean
}

const ResponsiveHeading: React.FC<ResponsiveHeadingProps> = ({
  children,
  level = 1,
  className = '',
  thai = false,
  animate = false
}) => {
  const HeadingComponent = `h${level}` as keyof React.JSX.IntrinsicElements
  
  const sizeClasses = {
    1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
    2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
    3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold',
    4: 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold',
    5: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium',
    6: 'text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium'
  }
  
  const fontFamilyClasses = thai ? 'thai-font' : ''
  
  const headingClasses = `${sizeClasses[level]} ${fontFamilyClasses} ${className}`.trim()

  const Component = animate ? motion(HeadingComponent as any) : HeadingComponent
  
  return (
    <Component
      className={headingClasses}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: level * 0.1 }
      })}
    >
      {children}
    </Component>
  )
}

// Responsive paragraph component
interface ResponsiveParagraphProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'muted'
  className?: string
  animate?: boolean
}

const ResponsiveParagraph: React.FC<ResponsiveParagraphProps> = ({
  children,
  size = 'md',
  color = 'primary',
  className = '',
  animate = false
}) => {
  const sizeClasses = {
    sm: 'text-xs sm:text-sm md:text-base',
    md: 'text-sm sm:text-base md:text-lg',
    lg: 'text-base sm:text-lg md:text-xl'
  }
  
  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500'
  }
  
  const paragraphClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`.trim()

  const Component = animate ? motion.p : 'p'
  
  return (
    <Component
      className={paragraphClasses}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      })}
    >
      {children}
    </Component>
  )
}

// Responsive label component
interface ResponsiveLabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const ResponsiveLabel: React.FC<ResponsiveLabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg'
  }
  
  const labelClasses = `${sizeClasses[size]} font-medium text-gray-700 ${className}`.trim()

  return (
    <label htmlFor={htmlFor} className={labelClasses}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

// Responsive badge component
interface ResponsiveBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animate?: boolean
}

const ResponsiveBadge: React.FC<ResponsiveBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  animate = false
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5',
    lg: 'text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2'
  }
  
  const badgeClasses = `inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()

  const Component = animate ? motion.span : 'span'
  
  return (
    <Component
      className={badgeClasses}
      {...(animate && {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      })}
    >
      {children}
    </Component>
  )
}

// Responsive text block component for complex layouts
interface ResponsiveTextBlockProps {
  children: React.ReactNode
  spacing?: 'tight' | 'normal' | 'loose'
  className?: string
  animate?: boolean
}

const ResponsiveTextBlock: React.FC<ResponsiveTextBlockProps> = ({
  children,
  spacing = 'normal',
  className = '',
  animate = false
}) => {
  const spacingClasses = {
    tight: 'space-y-1 sm:space-y-2',
    normal: 'space-y-2 sm:space-y-3 md:space-y-4',
    loose: 'space-y-4 sm:space-y-6 md:space-y-8'
  }
  
  const blockClasses = `${spacingClasses[spacing]} ${className}`.trim()

  const Component = animate ? motion.div : 'div'
  
  return (
    <Component
      className={blockClasses}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, staggerChildren: 0.1 }
      })}
    >
      {children}
    </Component>
  )
}

export {
  ResponsiveText,
  ResponsiveHeading,
  ResponsiveParagraph,
  ResponsiveLabel,
  ResponsiveBadge,
  ResponsiveTextBlock
}

export type {
  ResponsiveTextProps,
  ResponsiveHeadingProps,
  ResponsiveParagraphProps,
  ResponsiveLabelProps,
  ResponsiveBadgeProps,
  ResponsiveTextBlockProps
}
