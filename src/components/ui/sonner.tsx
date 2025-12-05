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
          "--normal-text": "var(--white)",
          "--normal-border": "var(--border)",

          "--success-bg": "var(--green-600)",
          "--success-text": "var(--white)",
          "--success-border": "var(--green-600)",

          "--error-bg": "var(--destructive)",
          "--error-text": "var(--white)",
          "--error-border": "var(--destructive)",

          "--info-bg": "var(--blue-600)",
          "--info-text": "var(--white)",
          "--info-border": "var(--blue-600)",
          
          "--warning-bg": "var(--yellow-500)",
          "--warning-text": "var(--white)",
          "--warning-border": "var(--yellow-500)",
        } as React.CSSProperties,
      }}
      {...props}
    />
  )
}

export { Toaster }