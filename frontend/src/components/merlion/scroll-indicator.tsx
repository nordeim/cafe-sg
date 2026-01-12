import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollIndicator = ({ className, ...props }: ScrollIndicatorProps) => {
  return (
    <div
      className={cn("scroll-indicator", className)}
      aria-hidden="true"
      {...props}
    >
      <div className="scroll-arrow" />
      <div className="scroll-text">SCROLL TO EXPLORE</div>
    </div>
  )
}

export { ScrollIndicator }
