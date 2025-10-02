"use client"

import * as React from "react"
import { Separator, Dialog as SheetPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"



import { cn } from "@/lib/utils"

function Sheet({
  ...props
}) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  title = "Menu", // default
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out",

          // Mobile (telas menores que md)
          "max-md:inset-0 max-md:h-full max-md:w-full max-md:border-b",
          "max-md:data-[state=open]:animate-in max-md:data-[state=open]:slide-in-from-top",
          "max-md:data-[state=closed]:animate-out max-md:data-[state=closed]:slide-out-to-top",

          // Desktop Right
          side === "right" && [
            "md:inset-y-0 md:right-0 md:h-full md:w-3/4 md:max-w-sm md:border-l",
            "md:data-[state=open]:slide-in-from-right",
            "md:data-[state=closed]:slide-out-to-right"
          ],

          // Desktop Left
          side === "left" && [
            "md:inset-y-0 md:left-0 md:h-full md:w-3/4 md:max-w-sm md:border-r",
            "md:data-[state=open]:slide-in-from-left",
            "md:data-[state=closed]:slide-out-to-left"
          ],

          className
        )}


        {...props}
      >

        <VisuallyHidden>
          <SheetTitle>{title}</SheetTitle>
        </VisuallyHidden>
        {children}
        <SheetPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="transition-transform duration-500 size-7 hover:rotate-90 hover:text-accent hover:scale-99" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props} />
  );
}

function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props} />
  );
}

function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props} />
  );
}

function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
