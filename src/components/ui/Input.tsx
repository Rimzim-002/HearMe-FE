import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  showValidation?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  label,
  error,
  helperText,
  showValidation = false,
  value,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const hasValue = value && value.toString().length > 0
  const isValid = hasValue && !error && showValidation
  const isPassword = type === 'password'
  
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            'hearme-input pr-12',
            error && 'border-red-500 focus:ring-red-500',
            isValid && 'border-green-500 focus:ring-green-500',
            isFocused && !error && !isValid && 'border-primary-500 focus:ring-primary-500',
            className
          )}
          ref={ref}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          
          <AnimatePresence>
            {showValidation && hasValue && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {error ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </motion.div>
  )
})

Input.displayName = 'Input'
export { Input }