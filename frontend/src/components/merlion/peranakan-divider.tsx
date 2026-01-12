import * as React from "react"
import { cn } from "@/lib/utils"

export interface PeranakanDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

const PeranakanDivider = ({ className, ...props }: PeranakanDividerProps) => {
  return <div className={cn("tile-pattern", className)} aria-hidden="true" {...props} />
}

export { PeranakanDivider }
