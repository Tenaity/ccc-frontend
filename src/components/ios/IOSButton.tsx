import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iosButtonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ios font-sf-pro text-ios-body font-semibold transition-all duration-150 ease-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-ios-blue text-white shadow-ios hover:bg-ios-blue/90 active:bg-ios-blue/80",
        secondary:
          "bg-ios-gray-5 text-ios-gray-DEFAULT dark:bg-slate-800 dark:text-slate-200 shadow-ios-sm hover:bg-ios-gray-4 dark:hover:bg-slate-700",
        destructive:
          "bg-ios-red text-white shadow-ios hover:bg-ios-red/90 active:bg-ios-red/80",
        glass:
          "glass text-foreground shadow-glass hover:bg-white/95 dark:hover:bg-slate-900/95",
        "glass-strong":
          "glass-strong text-foreground shadow-glass-lg hover:shadow-ios-lg",
        outline:
          "border-2 border-ios-blue text-ios-blue bg-transparent hover:bg-ios-blue/10 active:bg-ios-blue/20",
        ghost:
          "hover:bg-ios-gray-6 dark:hover:bg-slate-800 hover:text-foreground",
        link: "text-ios-blue underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-ios-sm px-3 text-ios-callout",
        md: "h-11 px-4 py-2",
        lg: "h-12 rounded-ios-lg px-6 text-ios-body",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface IOSButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iosButtonVariants> {
  asChild?: boolean;
}

const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(iosButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
IOSButton.displayName = "IOSButton";

export { IOSButton, iosButtonVariants };
