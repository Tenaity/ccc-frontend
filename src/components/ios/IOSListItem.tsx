import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IOSListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Leading icon or element
   */
  leading?: React.ReactNode;
  /**
   * Main title text
   */
  title: React.ReactNode;
  /**
   * Optional subtitle/description
   */
  subtitle?: React.ReactNode;
  /**
   * Trailing content (badge, value, etc.)
   */
  trailing?: React.ReactNode;
  /**
   * Show chevron indicator
   */
  showChevron?: boolean;
  /**
   * Interactive (clickable) item
   */
  interactive?: boolean;
}

const IOSListItem = React.forwardRef<HTMLDivElement, IOSListItemProps>(
  (
    {
      leading,
      title,
      subtitle,
      trailing,
      showChevron = false,
      interactive = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "ios-list-item flex items-center gap-3",
          interactive && "cursor-pointer hover:bg-ios-gray-6 dark:hover:bg-slate-800/50",
          className
        )}
        {...props}
      >
        {/* Leading icon/element */}
        {leading && (
          <div className="flex-shrink-0 text-ios-gray-DEFAULT dark:text-slate-400">
            {leading}
          </div>
        )}

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="font-sf-pro text-ios-body font-normal text-foreground">
            {title}
          </div>
          {subtitle && (
            <div className="font-sf-pro text-ios-footnote text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>

        {/* Trailing content */}
        {trailing && (
          <div className="flex-shrink-0 font-sf-pro text-ios-callout text-muted-foreground">
            {trailing}
          </div>
        )}

        {/* Chevron indicator */}
        {showChevron && (
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-ios-gray-3 dark:text-slate-600" />
        )}
      </div>
    );
  }
);
IOSListItem.displayName = "IOSListItem";

/**
 * Container for iOS-style list
 */
const IOSList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ios-card divide-y divide-ios-gray-5 dark:divide-slate-800 overflow-hidden",
      className
    )}
    {...props}
  />
));
IOSList.displayName = "IOSList";

export { IOSListItem, IOSList };
