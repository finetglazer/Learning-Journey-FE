"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: false,
        style: {
          background: "#ffffff",
          color: "#374151",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          padding: "16px",
          borderRadius: "8px",
        } as React.CSSProperties,
        classNames: {
          info: "!bg-blue-50 !text-blue-800 !border-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
