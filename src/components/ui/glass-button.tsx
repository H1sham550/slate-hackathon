"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-1.5 text-sm",
      default: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg",
    };
    return (
      <button
        ref={ref}
        className={cn("glass-btn", sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton };
