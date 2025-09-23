"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      toastOptions={{
        style: {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          "--success-bg": "var(--green-600)",
          "--success-text": "var(--white)",

          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",

          "--info-bg": "var(--blue-600)",
          "--info-text": "var(--white)",
          "--warning-bg": "var(--yellow-500)",
          "--warning-text": "var(--white)",
        } as React.CSSProperties,
      }}
      {...props}
    />
  )
}

export { Toaster }