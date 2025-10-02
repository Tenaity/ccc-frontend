import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iosCardVariants = cva("", {
  variants: {
    variant: {
      default: "ios-card",
      glass: "glass rounded-ios-lg",
      "glass-strong": "glass-strong rounded-ios-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface IOSCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iosCardVariants> {}

const IOSCard = React.forwardRef<HTMLDivElement, IOSCardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(iosCardVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
IOSCard.displayName = "IOSCard";

const IOSCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  />
));
IOSCardHeader.displayName = "IOSCardHeader";

const IOSCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-sf-pro text-ios-title-3 font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));
IOSCardTitle.displayName = "IOSCardTitle";

const IOSCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-sf-pro text-ios-subhead text-muted-foreground", className)}
    {...props}
  />
));
IOSCardDescription.displayName = "IOSCardDescription";

const IOSCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
));
IOSCardContent.displayName = "IOSCardContent";

const IOSCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
));
IOSCardFooter.displayName = "IOSCardFooter";

export {
  IOSCard,
  IOSCardHeader,
  IOSCardFooter,
  IOSCardTitle,
  IOSCardDescription,
  IOSCardContent,
};
