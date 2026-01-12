"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Sheet, SheetOverlay, SheetPortal, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { PeranakanDivider } from "@/components/merlion/peranakan-divider"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface NavLink {
  label: string
  href: string
}

interface MobileNavProps {
  links: NavLink[]
}

const MobileNavMerlion = ({ links }: MobileNavProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden border-kopi-brown/15 text-kopi-brown bg-transparent hover:bg-kopi-brown/5"
          aria-label="Open navigation"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetPortal>
        <SheetOverlay className="bg-kopi-brown/30 backdrop-blur-sm" />
        <SheetPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 h-full w-full max-w-full border-l border-kopi-brown/10 bg-nyonya-cream",
            "px-10 py-14 sm:max-w-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "data-[state=closed]:duration-300 data-[state=open]:duration-500",
            "flex flex-col"
          )}
        >
          <SheetPrimitive.Title className="sr-only">Menu</SheetPrimitive.Title>
          <SheetPrimitive.Description className="sr-only">Navigation links</SheetPrimitive.Description>

          <SheetPrimitive.Close
            className="absolute right-6 top-6 rounded-sm opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ui-terracotta focus:ring-offset-2 focus:ring-offset-nyonya-cream"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-kopi-brown" />
          </SheetPrimitive.Close>

          <div className="text-center">
            <div className="font-decorative text-3xl text-gold-leaf">☕</div>
            <div className="font-heading text-2xl font-600 tracking-tight text-ui-terracotta">Merlion Brews</div>
          </div>

          <PeranakanDivider className="my-10" />

          <nav className="flex flex-col items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-heading text-2xl font-600 text-kopi-brown transition-colors hover:text-ui-terracotta"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  )
}

export { MobileNavMerlion }
