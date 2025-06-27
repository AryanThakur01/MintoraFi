import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button as BtnShadCn } from '../ui/button'

interface IButtonProps extends React.ComponentProps<typeof BtnShadCn> {
  isLoading?: boolean
}
export const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ isLoading, ...props }, ref) => {
    return (
      <BtnShadCn ref={ref} {...props}>
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <></>}
        {props.children}
      </BtnShadCn>
    )
  },
)
