import * as React from "react"
import { cn } from "@/lib/utils"

export interface OrnamentProps extends React.SVGProps<SVGSVGElement> {
  position: 'tl' | 'tr' | 'bl' | 'br'
}

const Ornament = ({ position, className, ...props }: OrnamentProps) => {
  const rotation = {
    tl: "-rotate-15",
    tr: "rotate-15",
    bl: "rotate-15",
    br: "-rotate-15",
  }

  const positioning = {
    tl: "top-16 left-16",
    tr: "top-16 right-16",
    bl: "bottom-16 left-16",
    br: "bottom-16 right-16",
  }

  // Paths from cafe.html
  const getPaths = () => {
    switch (position) {
      case 'tl':
        return (
          <>
            <path className="peranakan-path" d="M20,80 Q40,60 60,80 T100,80 M10,90 Q30,70 50,90 T90,90 M5,95 Q25,75 45,95 T85,95" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="15" cy="85" r="2" fill="currentColor" />
            <circle cx="35" cy="75" r="1.5" fill="currentColor" />
            <circle cx="55" cy="85" r="2" fill="currentColor" />
            <circle cx="75" cy="75" r="1.5" fill="currentColor" />
            <circle cx="95" cy="85" r="2" fill="currentColor" />
          </>
        )
      case 'tr':
        return (
          <>
            <path className="peranakan-path" d="M80,80 Q60,60 40,80 T0,80 M90,90 Q70,70 50,90 T10,90 M95,95 Q75,75 55,95 T15,95" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="85" cy="85" r="2" fill="currentColor" />
            <circle cx="65" cy="75" r="1.5" fill="currentColor" />
            <circle cx="45" cy="85" r="2" fill="currentColor" />
            <circle cx="25" cy="75" r="1.5" fill="currentColor" />
            <circle cx="5" cy="85" r="2" fill="currentColor" />
          </>
        )
      case 'bl':
        return (
          <>
            <path className="peranakan-path" d="M20,20 Q40,40 60,20 T100,20 M10,10 Q30,30 50,10 T90,10 M5,5 Q25,25 45,5 T85,5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="15" cy="15" r="2" fill="currentColor" />
            <circle cx="35" cy="25" r="1.5" fill="currentColor" />
            <circle cx="55" cy="15" r="2" fill="currentColor" />
            <circle cx="75" cy="25" r="1.5" fill="currentColor" />
            <circle cx="95" cy="15" r="2" fill="currentColor" />
          </>
        )
      case 'br':
        return (
          <>
            <path className="peranakan-path" d="M80,20 Q60,40 40,20 T0,20 M90,10 Q70,30 50,10 T10,10 M95,5 Q75,25 55,5 T15,5" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="85" cy="15" r="2" fill="currentColor" />
            <circle cx="65" cy="25" r="1.5" fill="currentColor" />
            <circle cx="45" cy="15" r="2" fill="currentColor" />
            <circle cx="25" cy="25" r="1.5" fill="currentColor" />
            <circle cx="5" cy="15" r="2" fill="currentColor" />
          </>
        )
    }
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      aria-hidden="true"
      className={cn(
        "absolute w-[clamp(80px,10vw,150px)] h-[clamp(80px,10vw,150px)] opacity-60 z-0 text-ui-blue fill-current stroke-ui-gold",
        positioning[position],
        rotation[position],
        className
      )}
      {...props}
    >
      {getPaths()}
    </svg>
  )
}

export { Ornament }
