"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center -space-x-px",
        "[&>button]:rounded-none first:[&>button]:rounded-l-md last:[&>button]:rounded-r-md",
        "shadow-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
