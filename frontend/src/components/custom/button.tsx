import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button as BtnShadCn } from '../ui/button'

interface IButtonProps extends React.ComponentProps<typeof BtnShadCn> {
  isLoading?: boolean
  DefaultIcon?: React.ElementType
}
export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ isLoading, DefaultIcon = React.Fragment, ...props }, ref) => {
    return (
      <BtnShadCn ref={ref} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <DefaultIcon />}
        {props.children}
      </BtnShadCn>
    )
  },
)
