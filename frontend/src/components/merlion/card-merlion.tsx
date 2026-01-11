import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface CardMerlionProps extends React.HTMLAttributes<HTMLDivElement> {
  withFolioFrame?: boolean
}

const CardMerlion = React.forwardRef<HTMLDivElement, CardMerlionProps>(
  ({ className, withFolioFrame = true, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "bg-nyonya-cream border-none", // Reset Shadcn defaults to match Merlion aesthetic
          withFolioFrame && "folio-frame",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    )
  }
)
CardMerlion.displayName = "CardMerlion"

export { CardMerlion }
