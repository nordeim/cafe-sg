import * as React from "react"
import { cn } from "@/lib/utils"

export interface ZigzagSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const ZigzagSection = ({ children, className, ...props }: ZigzagSectionProps) => {
  return (
    <section className={cn("zigzag-grid flex flex-col gap-16", className)} {...props}>
      {children}
    </section>
  )
}

export interface ZigzagItemProps extends React.HTMLAttributes<HTMLDivElement> {
  image: React.ReactNode
  details: React.ReactNode
}

const ZigzagItem = ({ image, details, className, ...props }: ZigzagItemProps) => {
  return (
    <div 
      className={cn(
        "zigzag-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center even:md:[direction:rtl]",
        className
      )}
      {...props}
    >
      <div className="zigzag-image folio-frame aspect-square [direction:ltr]">
        {image}
      </div>
      <div className="zigzag-content py-6 [direction:ltr]">
        {details}
      </div>
    </div>
  )
}

export { ZigzagSection, ZigzagItem }
