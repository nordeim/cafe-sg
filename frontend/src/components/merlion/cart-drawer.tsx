"use client"

import * as React from "react"
import { useCartStore } from "@/lib/cart-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ButtonMerlion } from "./button-merlion"
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

export function CartDrawer() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const [isOpen, setIsOpen] = React.useState(false)

  const totalCents = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Sync reservation logic would go here (useEffect listening to items change)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="relative p-2 text-kopi-brown hover:text-ui-terracotta transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag className="w-6 h-6" />
          {items.length > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-ui-terracotta text-nyonya-cream text-xs rounded-full flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-nyonya-cream border-l-kopi-brown/10 flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-3xl text-ui-terracotta">Your Satchel</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-kopi-brown/60 py-12">
              <p>Your satchel is empty.</p>
              <p className="text-sm mt-2">Time to discover some beans?</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} className="flex gap-4">
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-600 text-kopi-brown">{item.name}</h4>
                  <div className="text-ui-gold font-decorative text-lg" role="text">
                    <span className="sr-only">Price: </span>
                    {/* Inline formatting if utils not ready */}
                    {`$${(item.price / 100).toFixed(2)}`}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.sku, Math.max(0, item.quantity - 1))}
                      className="p-1 hover:bg-black/5 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                      className="p-1 hover:bg-black/5 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeItem(item.sku)}
                      className="ml-auto text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-kopi-brown/10 pt-6 space-y-4">
          <div className="flex justify-between items-end">
            <span className="font-600 text-kopi-brown">Total</span>
            <div className="text-right">
              <span className="block font-decorative text-3xl text-ui-terracotta" role="text">
                <span className="sr-only">Total price: </span>
                {`$${(totalCents / 100).toFixed(2)}`}
              </span>
              <span className="text-xs text-kopi-brown/60">Incl. 9% GST</span>
            </div>
          </div>
          <ButtonMerlion className="w-full" disabled={items.length === 0}>
            Proceed to Checkout
          </ButtonMerlion>
        </div>
      </SheetContent>
    </Sheet>
  )
}
