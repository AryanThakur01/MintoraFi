import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const loaderVariants = cva(
  'animate-spin rounded-full border-4 border-primary border-t-transparent',
  {
    variants: {
      size: {
        button: 'size-4 border-2',
        small: 'size-8',
        medium: 'size-10',
        large: 'size-16',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

interface ILoaderProps {
  size?: 'button' | 'small' | 'medium' | 'large'
  className?: string
}
export const Loader: React.FC<ILoaderProps> = ({ size, className }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={cn(loaderVariants({ size }), className)}></div>
    </div>
  )
}
