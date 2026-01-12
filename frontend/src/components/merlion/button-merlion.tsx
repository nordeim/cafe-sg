import * as React from "react"
import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface ButtonMerlionProps extends Omit<ButtonProps, 'variant'> {
  variant?: "primary" | "secondary"
  href?: string
}

const ButtonMerlion = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonMerlionProps>(
  ({ className, variant = "primary", children, href, disabled, ...props }, ref) => {
    const classes = cn(
      buttonVariants({ variant: "default" }), // Start with base button styles
      "relative min-h-[3.5rem] px-8 font-body text-lg font-600 border-2 transition-all duration-medium ease-smooth overflow-hidden group",
      variant === "primary" && "bg-ui-terracotta text-nyonya-cream border-transparent hover:text-nyonya-cream hover:bg-ui-terracotta focus-visible:ring-ui-terracotta", // Override Shadcn hover
      variant === "secondary" && "bg-transparent border-ui-terracotta text-ui-terracotta hover:text-nyonya-cream hover:bg-transparent focus-visible:ring-ui-terracotta",
      (disabled || (props as any)['aria-disabled']) && "opacity-50 pointer-events-none",
      className
    )

    const content = (
      <>
        {/* Hover Underlay Span */}
        <span 
          className={cn(
            "absolute inset-0 -z-10 transform scale-x-0 origin-right transition-transform duration-medium ease-smooth group-hover:scale-x-100 group-hover:origin-left group-focus-visible:scale-x-100 group-focus-visible:origin-left",
            variant === "primary" ? "bg-terracotta" : "bg-ui-terracotta"
          )}
        />
        <span className="relative z-10">{children}</span>
      </>
    )

    if (href) {
      if (disabled) {
        return (
          <span 
            className={classes} 
            aria-disabled="true"
            role="link"
          >
            {content}
          </span>
        )
      }
      return (
        <Link 
          href={href} 
          className={classes}
          // @ts-ignore - Link ref typing is tricky with forwardRef union, safe to ignore for internal usage
          ref={ref as any}
        >
          {content}
        </Link>
      )
    }

    return (
      <Button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          "relative min-h-[3.5rem] px-8 font-body text-lg font-600 border-2 transition-all duration-medium ease-smooth overflow-hidden group",
          variant === "primary" && "bg-ui-terracotta text-nyonya-cream border-transparent hover:text-nyonya-cream hover:bg-ui-terracotta",
          variant === "secondary" && "bg-transparent border-ui-terracotta text-ui-terracotta hover:text-nyonya-cream hover:bg-transparent",
          className
        )}
        // We handle variants manually via className to ensure overrides work
        variant="default" 
        disabled={disabled}
        {...props}
      >
        {content}
      </Button>
    )
  }
)
ButtonMerlion.displayName = "ButtonMerlion"

export { ButtonMerlion }
