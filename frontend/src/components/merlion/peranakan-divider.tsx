import * as React from "react"
import { cn } from "@/lib/utils"

export interface PeranakanDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

const PeranakanDivider = React.forwardRef<HTMLDivElement, PeranakanDividerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("tile-pattern", className)}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
PeranakanDivider.displayName = "PeranakanDivider"

export { PeranakanDivider }