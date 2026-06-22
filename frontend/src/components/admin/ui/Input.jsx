import { useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

/**
 * Input component with validation and multiple types
 * Supports: text, email, password, textarea, select, date
 * Features: validation states, error messages, icons
 * Fully accessible with ARIA attributes
 * Uses CSS variables for theming
 */
export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  helperText,
  disabled = false,
  required = false,
  className = '',
  options = [], // For select type
  rows = 4, // For textarea type
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const isTextarea = type === 'textarea'
  const isSelect = type === 'select'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const baseClasses = 'w-full px-4 py-2.5 bg-[var(--bg-primary)] border rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : success
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
    : 'border-[var(--border-color)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20'

  const labelClasses = `block text-sm font-medium text-[var(--text-primary)] mb-1.5 ${
    required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''
  }`

  const handleBlur = (e) => onBlur?.(e)

  const renderInput = () => {
    if (isTextarea) {
      return (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${baseClasses} ${stateClasses} ${className} resize-none`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        />
      )
    }

    if (isSelect) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${stateClasses} ${className} pr-10`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${stateClasses} ${className} ${
            isPassword || error || success ? 'pr-10' : ''
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {!isPassword && error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={18} aria-hidden="true" />
          </div>
        )}
        {!isPassword && success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle size={18} aria-hidden="true" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
      )}
      {renderInput()}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p id={`${name}-helper`} className="mt-1.5 text-sm text-[var(--text-secondary)]">
          {helperText}
        </p>
      )}
    </div>
  )
}
