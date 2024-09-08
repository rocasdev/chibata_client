import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex transition-colors duration-300 h-10 w-full border-b-neutral-200 bg-transparent px-0 py-2 text-md ring-offset-white file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-b-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
