import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropCapProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DropCap = ({ className, ...props }: DropCapProps) => {
  return <p className={cn("drop-cap", className)} {...props} />
}

export { DropCap }
