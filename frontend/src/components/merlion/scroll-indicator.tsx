import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollIndicator = React.forwardRef<HTMLDivElement, ScrollIndicatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("scroll-indicator absolute bottom-16 left-1/2 -translate-x-1/2", className)}
        aria-hidden="true"
        {...props}
      >
        <div className="w-6 h-6 border-r-2 border-b-2 border-ui-terracotta rotate-45" />
        <span className="text-sm text-kopi-brown tracking-loose font-body">SCROLL TO EXPLORE</span>
      </div>
    )
  }
)
ScrollIndicator.displayName = "ScrollIndicator"

export { ScrollIndicator }