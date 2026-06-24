import React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

export function Tiles({
  className,
  rows = 12,
  cols = 20,
  tileClassName,
}) {
  const rowsArray = new Array(rows).fill(null)
  const colsArray = new Array(cols).fill(null)

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-hidden w-full h-full",
        className
      )}
    >
      <div className="flex flex-col w-full h-full">
        {rowsArray.map((_, ri) => (
          <div key={`row-${ri}`} className="flex flex-1 w-full">
            {colsArray.map((_, ci) => (
              <motion.div
                key={`tile-${ri}-${ci}`}
                className={cn(
                  "flex-1 border-r border-b border-white/[0.04] relative",
                  tileClassName
                )}
                whileHover={{
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  transition: { duration: 0 },
                }}
                animate={{ transition: { duration: 2 } }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
