import * as React from "react"
import { cn } from "@/lib/utils"

const TextureOverlay = ({ className }: { className?: string }) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 pointer-events-none z-[1] opacity-4 contain-paint",
        "bg-[radial-gradient(circle_at_10%_10%,rgba(58,42,31,0.05)_1px,transparent_1px),radial-gradient(circle_at_90%_90%,rgba(58,42,31,0.05)_1px,transparent_1px)]",
        "bg-[length:24px_24px]",
        className
      )}
      aria-hidden="true"
    />
  )
}

export { TextureOverlay }
