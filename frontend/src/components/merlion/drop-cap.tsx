import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropCapProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

const DropCap = React.forwardRef<HTMLSpanElement, DropCapProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("drop-cap block", className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)
DropCap.displayName = "DropCap"

export { DropCap }