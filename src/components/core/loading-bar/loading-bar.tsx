import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

// Define the component with custom styling
const GradientLoadingBar = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, ...props }, ref) => (
    <div className="flex flex-col items-center justify-center w-full max-w-sm p-6">
        {/* Loading Text */}
        <p className="text-lg font-medium text-cyan-400 mb-4">
            Loading...
        </p>

        {/* Progress Bar Container with a white glow effect */}
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-5 w-full overflow-hidden rounded-full bg-white p-1 shadow-[0_0_15px_rgba(255,255,255,0.9)]",
                className
            )}
            {...props}
        >
            {/* 
        Indicator with animated gradient.
        - `animate-loading-bar` is the custom animation class.
        - The gradient goes from cyan to green.
      */}
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-gradient-to-r from-cyan-300 via-teal-200 to-lime-300 transition-transform duration-500 animate-loading-bar"
                style={{ backgroundSize: '200% 200%' }}
            // The transform property is automatically handled by the Progress component
            // to show determinate progress, but our animation will override it for an
            // indeterminate look.
            />
        </ProgressPrimitive.Root>
    </div>
))
GradientLoadingBar.displayName = ProgressPrimitive.Root.displayName

export { GradientLoadingBar }