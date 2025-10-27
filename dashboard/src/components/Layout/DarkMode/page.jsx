"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "light", label: "Light", img: "/themes/light-preview.png" },
    { id: "dark", label: "Dark", img: "/themes/dark-preview.png" },
    { id: "system", label: "System", img: "/themes/system-preview.png" }, 
  ]

  return (
    <div className="flex gap-4">
      {themes.map((t) => {
        const isActive = theme === t.id || (t.id === "system" && theme === "system")

        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`relative border rounded-md overflow-hidden shadow-md transition-transform hover:scale-105 ${
              isActive ? "ring-2 ring-primary" : "border-gray-300"
            }`}
          >
            <img
              src={t.img}
              alt={t.label}
              className="w-32 h-20 object-cover"
            />
            <span className="absolute bottom-1 left-1 right-1 text-xs text-center bg-black/50 text-white rounded-sm">
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
