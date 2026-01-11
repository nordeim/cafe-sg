import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ButtonMerlionProps extends Omit<ButtonProps, 'variant'> {
  variant?: "primary" | "secondary"
}

const ButtonMerlion = React.forwardRef<HTMLButtonElement, ButtonMerlionProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative min-h-[3.5rem] px-8 font-body text-lg font-600 border-2 transition-all duration-medium ease-smooth overflow-hidden group",
          variant === "primary" && "bg-ui-terracotta text-nyonya-cream border-transparent hover:text-nyonya-cream",
          variant === "secondary" && "bg-transparent border-ui-terracotta text-ui-terracotta hover:text-nyonya-cream",
          className
        )}
        {...props}
      >
        {/* Hover Underlay Span */}
        <span 
          className={cn(
            "absolute inset-0 -z-10 transform scale-x-0 origin-right transition-transform duration-medium ease-smooth group-hover:scale-x-100 group-hover:origin-left group-focus:scale-x-100 group-focus:origin-left",
            variant === "primary" ? "bg-terracotta" : "bg-ui-terracotta"
          )}
        />
        <span className="relative z-10">{children}</span>
      </Button>
    )
  }
)
ButtonMerlion.displayName = "ButtonMerlion"

export { ButtonMerlion }
