import * as React from 'react'
import { cn } from '@/lib/utils'
import { SquareDashedIcon } from 'lucide-react'

type InputOTPProps = {
  length: number
  onChange: (value: string) => void
  value: string
  containerClassName?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ length, onChange, value, containerClassName, className, ...props }) => {
    const inputsRef = React.useRef<HTMLInputElement[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const val = e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(-1)
      const newValue = value.split('')
      newValue[idx] = val
      const joined = newValue.join('')
      onChange(joined)

      if (val && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (e.key === 'Backspace') {
        if (value[idx]) {
          const newValue = value.split('')
          newValue[idx] = ''
          onChange(newValue.join(''))
        } else if (idx > 0) {
          inputsRef.current[idx - 1]?.focus()
        }
      } else if (e.key === 'ArrowLeft') {
        inputsRef.current[idx - 1]?.focus()
      } else if (e.key === 'ArrowRight') {
        inputsRef.current[idx + 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData('text').slice(0, length)
      onChange(pasted)
      requestAnimationFrame(() => {
        inputsRef.current[pasted.length - 1]?.focus()
      })
    }

    return (
      <div className={cn('flex items-center gap-2', containerClassName)}>
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el!
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[idx] || ''}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className={cn(
              'w-10 h-10 text-center border border-input rounded-md text-sm shadow-sm transition-all',
              className,
            )}
            {...props}
          />
        ))}
      </div>
    )
  },
)
InputOTP.displayName = 'InputOTP'

const InputOTPSeparator = () => (
  <div role="separator" className="mx-1 text-muted">
    <SquareDashedIcon size={16} />
  </div>
)

export { InputOTP, InputOTPSeparator }
