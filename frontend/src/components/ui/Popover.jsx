import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={`z-50 max-h-[var(--radix-popover-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 text-black dark:text-white shadow-lg shadow-black/5 outline-none ${className ?? ""}`}
    {...props}
  >
    {children}
  </PopoverPrimitive.Content>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }
