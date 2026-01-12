"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PeranakanDivider } from "./peranakan-divider"

export interface NavLink {
  label: string
  href: string
}

interface MobileNavProps {
  links: NavLink[]
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 h-full w-full border-l border-kopi-brown/10 bg-nyonya-cream p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-kopi-brown">
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const MobileNavMerlion = ({ links }: MobileNavProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <SheetPrimitive.Root open={open} onOpenChange={setOpen}>
      <SheetPrimitive.Trigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden border-kopi-brown/15 text-kopi-brown hover:bg-kopi-brown/5 hover:text-ui-terracotta"
          aria-label="Open navigation"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetPrimitive.Trigger>
      <SheetContent className="flex flex-col items-center justify-center">
        <SheetPrimitive.Title className="sr-only">Navigation Menu</SheetPrimitive.Title>
        <SheetPrimitive.Description className="sr-only">Main site navigation links</SheetPrimitive.Description>
        
        <div className="w-full max-w-[200px] mb-8">
           <PeranakanDivider />
        </div>

        <nav className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-heading text-3xl font-600 text-kopi-brown transition-colors hover:text-ui-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="w-full max-w-[200px] mt-8">
           <PeranakanDivider />
        </div>
      </SheetContent>
    </SheetPrimitive.Root>
  )
}

export { MobileNavMerlion }