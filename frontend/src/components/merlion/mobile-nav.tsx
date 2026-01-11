"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
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
          className="md:hidden border-kopi-brown/15 text-kopi-brown"
          aria-label="Open navigation"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full bg-nyonya-cream border-l-kopi-brown/10 p-16 flex flex-col items-center gap-4"
      >
        <nav className="flex flex-col items-center gap-4 pt-16">
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
      </SheetContent>
    </Sheet>
  )
}

export { MobileNavMerlion }
